import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { AboutContent, ProjectItem, SiteContent, TeamCapability } from '@/lib/site-content'
import { extractStoragePath, getStorageBucketName, normalizeAssetRef } from '@/lib/asset-refs'

const SIGNED_URL_TTL_SECONDS = 60 * 60

type ContentKey = keyof SiteContent

async function createSignedAssetUrl(path: string): Promise<string> {
  const supabase = createServerSupabaseClient()
  const bucket = getStorageBucketName()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)

  if (error || !data?.signedUrl) {
    return ''
  }

  return data.signedUrl
}

export async function resolveAssetUrl(value: string | undefined): Promise<string | undefined> {
  const raw = String(value ?? '').trim()
  if (!raw) return undefined

  const path = extractStoragePath(raw)
  if (!path) {
    return raw
  }

  const signedUrl = await createSignedAssetUrl(path)
  return signedUrl || undefined
}

async function resolveProjects(projects: ProjectItem[]): Promise<ProjectItem[]> {
  return Promise.all(
    projects.map(async (project) => ({
      ...project,
      imageUrl: await resolveAssetUrl(project.imageUrl),
    })),
  )
}

async function resolveTeam(team: TeamCapability[]): Promise<TeamCapability[]> {
  return Promise.all(
    team.map(async (member) => ({
      ...member,
      imageUrl: await resolveAssetUrl(member.imageUrl),
    })),
  )
}

async function resolveAbout(about: AboutContent): Promise<AboutContent> {
  return {
    ...about,
    team: await resolveTeam(about.team),
    experience: {
      ...about.experience,
      imageUrl: await resolveAssetUrl(about.experience.imageUrl),
    },
  }
}

export async function resolveSiteContentAssets(content: SiteContent): Promise<SiteContent> {
  return {
    ...content,
    about: await resolveAbout(content.about),
    projects: await resolveProjects(content.projects),
  }
}

function normalizeProjects(projects: ProjectItem[]): ProjectItem[] {
  return projects.map((project) => ({
    ...project,
    imageUrl: normalizeAssetRef(project.imageUrl),
  }))
}

function normalizeTeam(team: TeamCapability[]): TeamCapability[] {
  return team.map((member) => ({
    ...member,
    imageUrl: normalizeAssetRef(member.imageUrl),
  }))
}

function normalizeAbout(about: AboutContent): AboutContent {
  return {
    ...about,
    team: normalizeTeam(about.team),
    experience: {
      ...about.experience,
      imageUrl: normalizeAssetRef(about.experience.imageUrl),
    },
  }
}

export function normalizeContentAssets<K extends ContentKey>(
  key: K,
  value: SiteContent[K],
): SiteContent[K] {
  if (key === 'projects') {
    return normalizeProjects(value as ProjectItem[]) as SiteContent[K]
  }

  if (key === 'about') {
    return normalizeAbout(value as AboutContent) as SiteContent[K]
  }

  return value
}

function collectAboutAssetPaths(about: AboutContent): string[] {
  const result = new Set<string>()

  const experiencePath = extractStoragePath(about.experience.imageUrl)
  if (experiencePath) result.add(experiencePath)

  for (const member of about.team) {
    const path = extractStoragePath(member.imageUrl)
    if (path) result.add(path)
  }

  return [...result]
}

function collectProjectAssetPaths(projects: ProjectItem[]): string[] {
  const result = new Set<string>()

  for (const project of projects) {
    const path = extractStoragePath(project.imageUrl)
    if (path) result.add(path)
  }

  return [...result]
}

export function collectAssetPathsForContent<K extends ContentKey>(
  key: K,
  value: SiteContent[K],
): string[] {
  if (key === 'about') {
    return collectAboutAssetPaths(value as AboutContent)
  }

  if (key === 'projects') {
    return collectProjectAssetPaths(value as ProjectItem[])
  }

  return []
}

export async function deleteStorageAssets(paths: string[]): Promise<void> {
  const uniquePaths = [...new Set(paths.map((path) => path.trim()).filter(Boolean))]
  if (uniquePaths.length === 0) return

  const supabase = createServerSupabaseClient()
  const bucket = getStorageBucketName()
  await supabase.storage.from(bucket).remove(uniquePaths)
}

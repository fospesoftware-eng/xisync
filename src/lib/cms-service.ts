import { supabase } from './supabase';

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CMSSection {
  id: string;
  page_id: string;
  section_type: string;
  section_key: string;
  content: Record<string, unknown>;
  order: number;
  is_active: boolean;
}

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  const { data, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching page:', error);
    return null;
  }

  return data;
}

export async function getPageSections(pageId: string): Promise<CMSSection[]> {
  const { data, error } = await supabase
    .from('cms_sections')
    .select('*')
    .eq('page_id', pageId)
    .eq('is_active', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching sections:', error);
    return [];
  }

  return data || [];
}

export async function getPageContent(slug: string): Promise<{ page: CMSPage | null; sections: CMSSection[] }> {
  const page = await getPageBySlug(slug);
  if (!page) {
    return { page: null, sections: [] };
  }

  const sections = await getPageSections(page.id);
  return { page, sections };
}

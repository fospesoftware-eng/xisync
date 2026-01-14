import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../lib/i18n';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface CMSPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CMSSection {
  id: string;
  page_id: string;
  section_type: string;
  section_key: string;
  content: Record<string, unknown>;
  order: number;
  is_active: boolean;
}

export function CMSPage() {
  const { t } = useI18n();
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<CMSSection | null>(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageData, setNewPageData] = useState({ slug: '', title: '', description: '' });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPages(data);
      if (data.length > 0) {
        setSelectedPage(data[0]);
        fetchSections(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchSections = async (pageId: string) => {
    const { data, error } = await supabase
      .from('cms_sections')
      .select('*')
      .eq('page_id', pageId)
      .order('order', { ascending: true });

    if (!error && data) {
      setSections(data);
    }
  };

  const handleCreatePage = async () => {
    if (!newPageData.slug || !newPageData.title) return;

    const { data, error } = await supabase
      .from('cms_pages')
      .insert([newPageData])
      .select();

    if (!error && data) {
      setPages([...pages, data[0]]);
      setNewPageData({ slug: '', title: '', description: '' });
      setShowNewPageForm(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure? This will delete all sections in this page.')) return;

    const { error } = await supabase
      .from('cms_pages')
      .delete()
      .eq('id', pageId);

    if (!error) {
      setPages(pages.filter(p => p.id !== pageId));
      setSelectedPage(null);
      setSections([]);
    }
  };

  const handleUpdateSection = async (section: CMSSection) => {
    const { error } = await supabase
      .from('cms_sections')
      .update({ ...section, updated_at: new Date().toISOString() })
      .eq('id', section.id);

    if (!error) {
      setSections(sections.map(s => s.id === section.id ? section : s));
      setEditingSection(null);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const { error } = await supabase
      .from('cms_sections')
      .delete()
      .eq('id', sectionId);

    if (!error) {
      setSections(sections.filter(s => s.id !== sectionId));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website CMS</h1>
        <p className="text-gray-600">Manage your website content and pages</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Pages Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
              <button
                onClick={() => setShowNewPageForm(!showNewPageForm)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showNewPageForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <input
                  type="text"
                  placeholder="Page slug (e.g., home)"
                  value={newPageData.slug}
                  onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Page title"
                  value={newPageData.title}
                  onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newPageData.description}
                  onChange={(e) => setNewPageData({ ...newPageData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePage}
                    className="flex-1 px-3 py-2 bg-xisync-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-xisync-cyan-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewPageForm(false)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPage?.id === page.id
                      ? 'bg-xisync-cyan-50 border border-xisync-cyan-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedPage(page);
                      fetchSections(page.id);
                    }}
                    className="flex-1"
                  >
                    <div className="font-medium text-sm text-gray-900">{page.title}</div>
                    <div className="text-xs text-gray-500">/{page.slug}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(page.id);
                    }}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="col-span-9">
          {selectedPage ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{selectedPage.title} - Sections</h2>

              {editingSection ? (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Type
                      </label>
                      <input
                        type="text"
                        value={editingSection.section_type}
                        onChange={(e) =>
                          setEditingSection({ ...editingSection, section_type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (JSON)
                      </label>
                      <textarea
                        value={JSON.stringify(editingSection.content, null, 2)}
                        onChange={(e) => {
                          try {
                            setEditingSection({
                              ...editingSection,
                              content: JSON.parse(e.target.value),
                            });
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm h-48"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateSection(editingSection)}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {sections.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No sections yet</p>
                ) : (
                  sections.map((section) => (
                    <div key={section.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{section.section_key}</div>
                          <div className="text-sm text-gray-600">{section.section_type}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Order: {section.order} | Active: {section.is_active ? 'Yes' : 'No'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSection(section)}
                            className="p-2 text-xisync-cyan-600 hover:bg-xisync-cyan-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Select a page to manage its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

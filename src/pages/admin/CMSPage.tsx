import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../lib/i18n';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
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
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [editingSection, setEditingSection] = useState<CMSSection | null>(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageData, setNewPageData] = useState({ slug: '', title: '', description: '' });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
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
    if (!confirm(t('Are you sure? This will delete all sections in this page.', '确定要删除吗？这将删除该页面下的所有板块。'))) return;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Website CMS', '网站内容管理')}</h1>
        <p className="text-gray-600">{t('Manage your website content and pages', '管理网站内容与页面')}</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Pages Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('Pages', '页面')}</h2>
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
                  placeholder={t('Page slug (e.g., home)', '页面标识（如 home）')}
                  value={newPageData.slug}
                  onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder={t('Page title', '页面标题')}
                  value={newPageData.title}
                  onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder={t('Description', '描述')}
                  value={newPageData.description}
                  onChange={(e) => setNewPageData({ ...newPageData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePage}
                    className="flex-1 px-3 py-2 bg-xisync-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-xisync-cyan-700"
                  >
                    {t('Create', '创建')}
                  </button>
                  <button
                    onClick={() => setShowNewPageForm(false)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    {t('Cancel', '取消')}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{selectedPage.title} - {t('Sections', '板块')}</h2>

              {editingSection ? (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('Edit Section', '编辑板块')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Section Type', '板块类型')}
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
                        {t('Content (JSON)', '内容（JSON）')}
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
                        {t('Save Changes', '保存修改')}
                      </Button>
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                      >
                        {t('Cancel', '取消')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {sections.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{t('No sections yet', '暂无板块')}</p>
                ) : (
                  sections.map((section) => (
                    <div key={section.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{section.section_key}</div>
                          <div className="text-sm text-gray-600">{section.section_type}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {t('Order', '排序')}: {section.order} | {t('Active', '启用')}: {section.is_active ? t('Yes', '是') : t('No', '否')}
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
              <p className="text-gray-500">{t('Select a page to manage its content', '请选择一个页面以管理其内容')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

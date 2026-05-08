'use client';

import React, { useEffect, useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { getArticles, updateArticle, deleteArticle } from '@/lib/api/admin';
import type { Article } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Eye, EyeOff, Trash2, FileText } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const CATEGORIES = ['Rituals', 'Festivals', 'Astrology', 'Vastu', 'Spirituality', 'General'];

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('en');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        // Fetch all articles then find by ID since there is no getArticleById in admin API
        const res = await getArticles({ size: 1000 });
        if (res.success && res.data) {
          const found = res.data.content.find((a: Article) => a.id === id);
          if (found) {
            setArticle(found);
            setTitle(found.title);
            setCategory(found.category || '');
            setCoverImage(found.coverImage || '');
            setContent(found.content || '');
            setTags(found.tags?.join(', ') || '');
            setStatus(found.status);
          } else {
            toast.error('Article not found');
          }
        } else {
          toast.error('Failed to load article');
        }
      } catch {
        toast.error('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSave = async (newStatus?: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await updateArticle(id, {
        title,
        content,
        category,
        coverImage,
        tags: tagList,
        status: newStatus || status,
      });

      if (res.success && res.data) {
        setArticle(res.data);
        setStatus(res.data.status);
        toast.success('Article updated successfully');
      } else {
        toast.error(res.message || 'Failed to update article');
      }
    } catch {
      toast.error('Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteArticle(id);
      if (res.success) {
        toast.success('Article deleted');
        router.push('/admin/articles');
      } else {
        toast.error(res.message || 'Failed to delete article');
      }
    } catch {
      toast.error('Failed to delete article');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Article not found</p>
        <Button variant="outline" onClick={() => router.push('/admin/articles')}>
          <ArrowLeft className="h-4 w-4" /> Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/articles')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
            <p className="text-sm text-gray-500">ID: {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setPreview(!preview)}>
            {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={() => handleSave('DRAFT')} isLoading={saving}>
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={() => handleSave('PUBLISHED')} isLoading={saving}>
            <FileText className="h-4 w-4" /> Publish
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {preview ? (
        <Card>
          <CardContent className="p-8">
            {coverImage && (
              <img src={coverImage} alt="Cover" className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title || 'Untitled'}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Body</label>
                  <div className="min-h-[300px]">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={quillModules}
                      placeholder="Write your article..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Cover Image URL"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                />
                <Input
                  label="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="ritual, festival, puja"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Article?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The article will be permanently deleted.</p>
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="secondary" size="sm" onClick={handleDelete} isLoading={deleting}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

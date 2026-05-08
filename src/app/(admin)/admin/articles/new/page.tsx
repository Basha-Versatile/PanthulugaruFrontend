'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { createArticle } from '@/lib/api/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Eye, EyeOff, FileText } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const CATEGORIES = ['Rituals', 'Festivals', 'Astrology', 'Vastu', 'Spirituality', 'General'];

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('en');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

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

  const handleSave = useCallback(async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    setSaving(true);
    try {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await createArticle({
        title,
        content,
        category,
        coverImage,
        tags: tagList,
        status,
      });

      if (res.success && res.data) {
        toast.success(status === 'PUBLISHED' ? 'Article published!' : 'Article saved as draft');
        router.push('/admin/articles');
      } else {
        toast.error(res.message || 'Failed to save article');
      }
    } catch {
      toast.error('Failed to save article');
    } finally {
      setSaving(false);
    }
  }, [title, content, category, coverImage, tags, router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/articles')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
            <p className="text-sm text-gray-500">Create a new article</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {preview ? (
        <Card>
          <CardContent className="p-8">
            {coverImage && (
              <img src={coverImage} alt="Cover" className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title || 'Untitled'}</h1>
            <div className="flex items-center gap-2 mb-6">
              {category && <span className="text-sm text-[#E07B39]">{category}</span>}
              <span className="text-sm text-gray-400">{language.toUpperCase()}</span>
            </div>
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
    </div>
  );
}

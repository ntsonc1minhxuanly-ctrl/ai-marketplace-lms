"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_COURSE_DETAILS } from "@/lib/mockData";
import { 
  PlayCircle, 
  CheckCircle2, 
  Download, 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  Menu,
  ChevronDown,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const router = useRouter();

  // Tìm khóa học
  const product = MOCK_PRODUCTS.find(p => p.id === courseId);
  const courseDetail = (MOCK_COURSE_DETAILS as any)[courseId as string];

  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Khởi động bài học đầu tiên
  useEffect(() => {
    if (courseDetail?.chapters?.[0]?.lessons?.[0]) {
      setActiveLesson(courseDetail.chapters[0].lessons[0]);
    }
  }, [courseDetail]);

  if (!product || !courseDetail) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Không tìm thấy khóa học</h2>
        <p className="text-xs text-slate-400">Khóa học này không tồn tại hoặc tài khoản chưa kích hoạt sở hữu.</p>
        <Link href="/dashboard?tab=courses" className="text-xs font-bold text-blue-400 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Dashboard
        </Link>
      </div>
    );
  }

  // Quản lý việc đánh dấu hoàn thành bài học
  const toggleCompleteLesson = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => prev.filter(id => id !== lessonId));
    } else {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  // Tính toán phần trăm hoàn thành
  const totalLessonsCount = courseDetail.chapters.reduce((acc: number, chap: any) => acc + chap.lessons.length, 0);
  const progressPercent = totalLessonsCount > 0 
    ? Math.round((completedLessonIds.length / totalLessonsCount) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start -mt-4">
      {/* Top Breadcrumb Navigation bar */}
      <div className="lg:col-span-12 flex justify-between items-center border-b border-white/5 pb-4 mb-2">
        <div className="flex items-center gap-3">
          <Link href="/dashboard?tab=courses" className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white line-clamp-1">{product.title}</h1>
            <p className="text-[10px] text-slate-500">LMS Learning Platform (Môi trường học tập)</p>
          </div>
        </div>

        {/* Progress statistics bar */}
        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Tiến độ khóa học:</p>
            <p className="text-xs font-bold text-white">{completedLessonIds.length}/{totalLessonsCount} bài học ({progressPercent}%)</p>
          </div>
          <div className="w-24 h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main player area */}
      <div className="lg:col-span-8 space-y-6">
        {activeLesson ? (
          <>
            {/* Video player box */}
            {activeLesson.videoUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/8 bg-slate-900/40 aspect-video relative">
                <video 
                  key={activeLesson.id}
                  src={activeLesson.videoUrl} 
                  controls 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Lesson detail title and complete action */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">{activeLesson.title}</h2>
                <p className="text-xs text-slate-500">Thời lượng học: {activeLesson.duration} phút</p>
              </div>

              {/* Complete checker */}
              <button
                onClick={() => toggleCompleteLesson(activeLesson.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  completedLessonIds.includes(activeLesson.id)
                    ? "bg-emerald-600/20 border border-emerald-800/40 text-emerald-400"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedLessonIds.includes(activeLesson.id) ? "Đã hoàn thành!" : "Đánh dấu hoàn thành"}
              </button>
            </div>

            {/* Lesson text content detail */}
            {activeLesson.content && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mô tả bài giảng</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-white/5">
                  {activeLesson.content}
                </p>
              </div>
            )}

            {/* Attachments and resource downloads */}
            {(activeLesson.pdfUrl || activeLesson.docUrl) && (
              <div className="space-y-3 border-t border-white/5 pt-6">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tài liệu đính kèm bài giảng</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLesson.pdfUrl && (
                    <Link 
                      href={activeLesson.pdfUrl}
                      target="_blank"
                      className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs hover:text-white transition-all hover:bg-white/5"
                    >
                      <span className="flex items-center gap-2 text-red-400">
                        <FileText className="w-4 h-4 shrink-0" />
                        Tài liệu lý thuyết (PDF)
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  )}
                  {activeLesson.docUrl && (
                    <Link 
                      href={activeLesson.docUrl}
                      target="_blank"
                      className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs hover:text-white transition-all hover:bg-white/5"
                    >
                      <span className="flex items-center gap-2 text-blue-400">
                        <FileText className="w-4 h-4 shrink-0" />
                        Bài tập thực hành (Docx)
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center text-slate-500 text-xs">
            Chọn một bài học từ menu bên phải để bắt đầu học.
          </div>
        )}
      </div>

      {/* Course curriculum sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-4 rounded-2xl glass-panel bg-slate-900/60 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Giáo trình khóa học
          </h3>
          
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {courseDetail.chapters.map((chap: any) => (
              <div key={chap.id} className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 border-b border-white/5 pb-1">
                  {chap.title}
                </div>
                <div className="space-y-1">
                  {chap.lessons.map((les: any) => {
                    const isActive = activeLesson?.id === les.id;
                    const isCompleted = completedLessonIds.includes(les.id);
                    
                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLesson(les)}
                        className={`w-full p-2.5 rounded-lg text-left text-xs flex justify-between items-center transition-all ${
                          isActive 
                            ? "bg-purple-950/30 border border-purple-800/40 text-purple-300 font-bold" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate pr-2">
                          <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                          <span className="truncate">{les.title}</span>
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

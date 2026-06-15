export interface MockProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: number;
  salePrice?: number;
  image: string;
  type: "AI_TOOL" | "COURSE" | "PROMPT" | "EBOOK" | "AI_ACCOUNT" | "WORKFLOW" | "AUTOMATION" | "TEMPLATE" | "SERVICE";
  demoUrl?: string;
  downloadUrl?: string;
  licenseKey?: string;
  rating: number;
  reviewsCount: number;
  metadata?: any;
}

export interface MockPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image: string;
  category: "AI" | "Automation" | "Marketing" | "No-code" | "Technology";
  authorName: string;
  authorImage?: string;
  faqs?: { q: string; a: string }[];
  createdAt: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  // 1. Tool AI
  {
    id: "prod-tool-1",
    title: "AI Writer Pro - Viết Content Hàng Loạt",
    slug: "ai-writer-pro-content",
    description: "Công cụ tối ưu hóa SEO và viết bài tự động chuẩn 2026. Tích hợp trực tiếp các mô hình AI tiên tiến nhất giúp bạn lên hàng trăm bài viết mỗi ngày chỉ với một từ khóa.",
    shortDesc: "Tự động sản xuất bài viết chuẩn SEO và copywrite chuyển đổi cao trong 30 giây.",
    price: 990000,
    salePrice: 490000,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    type: "AI_TOOL",
    demoUrl: "/ai-tools",
    licenseKey: "AIWRITEPRO-XXXX-YYYY-ZZZZ",
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: "prod-tool-2",
    title: "SEO Meta Generator AI",
    slug: "seo-meta-generator-ai",
    description: "Bộ tạo thẻ meta, tiêu đề bài viết, thẻ alt ảnh tự động bằng công nghệ học máy sâu, giúp website nhanh chóng leo top Google và Bing Search.",
    shortDesc: "Tạo hàng ngàn thẻ Meta Title, Description chuẩn SEO tự động tối ưu hóa CTR.",
    price: 350000,
    salePrice: 199000,
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80",
    type: "AI_TOOL",
    demoUrl: "/ai-tools",
    licenseKey: "METAGENAI-1122-3344",
    rating: 4.9,
    reviewsCount: 89,
  },
  
  // 2. Tài khoản AI
  {
    id: "prod-acc-1",
    title: "Tài khoản ChatGPT Plus (Shared 1 Tháng)",
    slug: "chatgpt-plus-1month-shared",
    description: "Tài khoản ChatGPT Plus dùng chung, đầy đủ tính năng GPT-4o, DALL-E 3, Custom GPTs và truy cập internet tốc độ cao, cực kỳ tiết kiệm.",
    shortDesc: "Trải nghiệm ChatGPT Plus đầy đủ quyền lợi với chi phí rẻ nhất.",
    price: 150000,
    salePrice: 890000,
    image: "https://images.unsplash.com/photo-1675557009875-436f09780264?w=800&auto=format&fit=crop&q=80",
    type: "AI_ACCOUNT",
    licenseKey: "Tài khoản: chatgpt_plus_dev1@platform.com | Mật khẩu: DevPass123!",
    rating: 4.5,
    reviewsCount: 342,
  },
  {
    id: "prod-acc-2",
    title: "Midjourney Premium Account (Plan Basic 1 Tháng)",
    slug: "midjourney-premium-1month",
    description: "Tài khoản vẽ tranh AI chuyên nghiệp Midjourney. Nhận tài khoản riêng tư hoặc dùng chung tùy chọn. Hỗ trợ tạo ảnh chất lượng siêu thực không giới hạn.",
    shortDesc: "Vẽ tranh nghệ thuật AI chất lượng cao cùng tài khoản Midjourney Pro.",
    price: 350000,
    salePrice: 280000,
    image: "https://images.unsplash.com/photo-1684369175833-31f67f67b447?w=800&auto=format&fit=crop&q=80",
    type: "AI_ACCOUNT",
    licenseKey: "Tài khoản: midjourney_pro_sub8@art.com | Mật khẩu: PaintArt2026",
    rating: 4.7,
    reviewsCount: 215,
  },

  // 3. Khóa học online
  {
    id: "prod-course-1",
    title: "Khóa Học Làm Chủ Prompt Engineering & AI Workflow",
    slug: "khoa-hoc-lam-chu-prompt-engineering",
    description: "Học cách thiết kế câu lệnh tối ưu hiệu năng, xây dựng các tác vụ tự động hóa quy trình kinh doanh (workflows) bằng n8n, Make và Google AI Studio.",
    shortDesc: "Học viết Prompt chuyên nghiệp từ cơ bản đến nâng cao để tự động hóa công việc.",
    price: 2400000,
    salePrice: 790000,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    type: "COURSE",
    rating: 4.9,
    reviewsCount: 412,
  },
  {
    id: "prod-course-2",
    title: "Xây Dựng Hệ Thống Bán Hàng Tự Động Từ A-Z",
    slug: "xay-dung-he-thong-ban-hang-tu-dong",
    description: "Khóa học thực chiến hướng dẫn tạo phễu bán hàng tự động, liên kết email marketing, cổng thanh toán ngân hàng trực tuyến và chatbot chăm sóc khách hàng.",
    shortDesc: "Thiết lập cỗ máy bán hàng online tự động mang về nguồn thu nhập thụ động.",
    price: 1800000,
    salePrice: 590000,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    type: "COURSE",
    rating: 4.8,
    reviewsCount: 289,
  },

  // 4. Prompt AI
  {
    id: "prod-prompt-1",
    title: "Bộ 1000+ Prompt ChatGPT Cho Marketers & Coder",
    slug: "1000-prompt-chatgpt-marketers-coders",
    description: "Thư viện prompt khổng lồ được phân loại kỹ lưỡng cho viết blog, chạy quảng cáo, viết mã nguồn Python, tối ưu database và giải quyết lỗi phần mềm nhanh chóng.",
    shortDesc: "Tiết kiệm 90% thời gian suy nghĩ câu lệnh nhờ bộ prompt soạn sẵn siêu việt.",
    price: 199000,
    salePrice: 99000,
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&auto=format&fit=crop&q=80",
    type: "PROMPT",
    downloadUrl: "/downloads/1000_prompt_library.zip",
    rating: 4.6,
    reviewsCount: 88,
  },

  // 5. Ebook
  {
    id: "prod-ebook-1",
    title: "Ebook: Cẩm Nang Khởi Nghiệp SaaS 2026 - Bootstrapping",
    slug: "ebook-cam-nang-khoi-nghiep-saas-2026",
    description: "Cuốn sách hướng dẫn chi tiết cách tự xây dựng, đóng gói và vận hành sản phẩm phần mềm dạng dịch vụ (SaaS) từ số vốn nhỏ, không cần gọi vốn đầu tư mạo hiểm.",
    shortDesc: "Bí quyết xây dựng phần mềm SaaS triệu đô từ người đi trước.",
    price: 250000,
    salePrice: 149000,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80",
    type: "EBOOK",
    downloadUrl: "/downloads/saas_bootstrapping_guide.pdf",
    rating: 4.7,
    reviewsCount: 154,
  },

  // 6. Workflow Automation
  {
    id: "prod-flow-1",
    title: "Kịch Bản n8n Đồng Bộ Lịch & Auto Gửi Email Chăm Sóc",
    slug: "kich-ban-n8n-dong-bo-auto-email",
    description: "Workflow n8n hoàn chỉnh giúp bạn tự động thu thập thông tin khách hàng từ Google Sheets, gửi email qua Resend và cập nhật lịch hẹn trên Google Calendar tự động.",
    shortDesc: "File JSON nhập trực tiếp vào n8n giúp đồng bộ lịch hẹn và gửi email tự động.",
    price: 499000,
    salePrice: 299000,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    type: "WORKFLOW",
    downloadUrl: "/downloads/n8n_appointment_automation.json",
    rating: 4.8,
    reviewsCount: 56,
  },

  // 7. Template
  {
    id: "prod-temp-1",
    title: "Template Notion Workspace Quản Lý Dự Án SaaS",
    slug: "notion-workspace-quan-ly-du-an-saas",
    description: "Hệ thống Notion Workspace chuyên nghiệp gồm bảng Kanban, CRM quản lý khách hàng tiềm năng, lịch theo dõi doanh thu và báo cáo tiến độ công việc hàng tuần.",
    shortDesc: "Quản trị toàn bộ dự án startup SaaS của bạn trên một trang Notion tinh gọn.",
    price: 199000,
    salePrice: 99000,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
    type: "TEMPLATE",
    downloadUrl: "https://notion.so/template-saas-workspace-demo",
    rating: 4.9,
    reviewsCount: 182,
  }
];

export const MOCK_BLOG_POSTS: MockPost[] = [
  {
    id: "post-1",
    title: "Cách Sử Dụng Prompt Engineering Để Tăng Năng Suất Gấp 10 Lần",
    slug: "cach-su-dung-prompt-engineering-tang-nang-suat",
    summary: "Tìm hiểu bản chất của kỹ thuật tạo câu lệnh (Prompt) và các cấu trúc câu lệnh vàng để ChatGPT, Claude tạo ra kết quả chính xác nhất.",
    content: `<p>Trong thời đại trí tuệ nhân tạo phát triển vượt bậc, khả năng đặt câu hỏi và giao tiếp với AI đang trở thành một kỹ năng tối quan trọng. Đó chính là <strong>Prompt Engineering</strong>.</p>
    <h2>1. Cấu trúc một câu lệnh chuẩn vàng</h2>
    <p>Một prompt hoàn hảo cần bao gồm 4 yếu tố cốt lõi sau:</p>
    <ul>
      <li><strong>Vai trò (Role)</strong>: Định nghĩa danh tính của AI (Ví dụ: Bạn là một lập trình viên React).</li>
      <li><strong>Nhiệm vụ (Task)</strong>: Yêu cầu AI làm gì (Ví dụ: Hãy tối ưu hóa hàm tính toán sau).</li>
      <li><strong>Ngữ cảnh (Context)</strong>: Cung cấp thông tin nền cần thiết để AI hiểu sâu hơn.</li>
      <li><strong>Định dạng đầu ra (Format)</strong>: Yêu cầu định dạng (Ví dụ: Trình bày dạng bảng hoặc markdown code block).</li>
    </ul>
    <h2>2. Kỹ thuật "Few-Shot Prompting"</h2>
    <p>Hãy cung cấp từ 1 đến 3 ví dụ mẫu cho AI trước khi yêu cầu kết quả cuối cùng. Cách làm này giúp AI nắm bắt văn phong và hướng tư duy của bạn cực kỳ nhanh chóng.</p>`,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    category: "AI",
    authorName: "Lê Hoàng AI",
    createdAt: "2026-06-10T10:00:00Z",
    faqs: [
      { q: "Prompt Engineering có khó học không?", a: "Hoàn toàn không, bạn chỉ cần nắm được quy trình và các thành phần cốt lõi của câu lệnh để luyện tập mỗi ngày." },
      { q: "Tôi có thể ứng dụng nó vào lập trình không?", a: "Có, prompt giúp sinh code nhanh hơn, viết test cases và tìm lỗi vô cùng hiệu quả." }
    ]
  },
  {
    id: "post-2",
    title: "Tự Động Hóa Quy Trình Bán Hàng Với n8n & Google Sheets",
    slug: "tu-dong-hoa-quy-trinh-ban-hang-n8n-google-sheets",
    summary: "Hướng dẫn từng bước cách thiết lập chatbot tự động lưu thông tin khách hàng vào trang tính Google Sheets và bắn thông báo về Telegram.",
    content: `<p>Tự động hóa (Automation) giúp doanh nghiệp vận hành trơn tru mà không tốn nhiều nhân sự điều phối thủ công. Hãy cùng tìm hiểu cách setup workflow với n8n.</p>
    <h2>Tại sao chọn n8n thay vì Zapier?</h2>
    <p>n8n là công cụ no-code/low-code tự động hóa cực kỳ mạnh mẽ với chi phí rẻ hơn nhiều so với Zapier, cho phép self-host miễn phí và không bị giới hạn số lượng bước chạy (steps).</p>
    <h2>Các bước triển khai cơ bản</h2>
    <p>1. Cấu hình Webhook trigger để nhận dữ liệu từ biểu mẫu website của bạn.<br>
    2. Sử dụng Node Google Sheets để chèn dữ liệu khách hàng vào trang tính.<br>
    3. Thêm Node Telegram để đẩy thông báo thời gian thực về nhóm chat của bạn.</p>`,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    category: "Automation",
    authorName: "Đỗ Minh Automation",
    createdAt: "2026-06-12T14:30:00Z",
    faqs: [
      { q: "n8n có cần biết lập trình không?", a: "Hầu hết các tác vụ đều kéo thả, tuy nhiên biết một chút Javascript sẽ giúp bạn tùy biến dữ liệu thông minh hơn." }
    ]
  }
];

// Khóa học chi tiết
export const MOCK_COURSE_DETAILS = {
  "prod-course-1": {
    id: "course-1",
    productId: "prod-course-1",
    chapters: [
      {
        id: "chap-1",
        title: "Chương 1: Giới thiệu & Khái niệm Cơ bản",
        order: 1,
        lessons: [
          {
            id: "les-1-1",
            title: "Bài 1.1: Trí Tuệ Nhân Tạo & Cách Thức Hoạt Động Của LLMs",
            content: "LLM (Large Language Model) hoạt động dựa trên cơ chế dự đoán từ tiếp theo dựa theo xác suất. Trong bài này, chúng ta tìm hiểu sâu về kiến trúc Transformer.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            pdfUrl: "file:///C:/Users/Moderator/Downloads/AI_Transformer_Concept.pdf",
            docUrl: "file:///C:/Users/Moderator/Downloads/Workspace_Guides.docx",
            duration: 12,
            order: 1,
          },
          {
            id: "les-1-2",
            title: "Bài 1.2: Thiết Lập Môi Trường Làm Việc Với Google AI Studio",
            content: "Hướng dẫn lấy API key từ Google AI Studio và cấu hình môi trường test prompt nhanh chóng.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            duration: 18,
            order: 2,
          }
        ]
      },
      {
        id: "chap-2",
        title: "Chương 2: Thiết Kế Prompt Chuyên Sâu",
        order: 2,
        lessons: [
          {
            id: "les-2-1",
            title: "Bài 2.1: Vai Trò Của System Instruction & Context",
            content: "System Instruction giúp cố định hành vi của AI trước khi nhận câu hỏi của người dùng. Đây là chìa khóa xây dựng Chatbot thông minh.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            pdfUrl: "file:///C:/Users/Moderator/Downloads/System_Prompts_Book.pdf",
            duration: 25,
            order: 1,
          }
        ]
      }
    ]
  },
  "prod-course-2": {
    id: "course-2",
    productId: "prod-course-2",
    chapters: [
      {
        id: "chap-2-1",
        title: "Chương 1: Thiết lập phễu bán hàng tự động",
        order: 1,
        lessons: [
          {
            id: "les-2-1-1",
            title: "Bài 1.1: Tư duy thiết kế phễu triệu đô",
            content: "Làm thế nào để chuyển đổi từ người dùng vãng lai thành khách hàng trung thành mua hàng lặp lại nhiều lần.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            duration: 15,
            order: 1,
          }
        ]
      }
    ]
  }
};

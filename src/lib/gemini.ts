export async function generateAIResponse(toolName: string, prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativetool.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Bạn là trợ lý AI chuyên nghiệp trên nền tảng Marketplace và LMS. Nhiệm vụ: ${getToolInstruction(toolName)}. Prompt của người dùng: ${prompt}`
                  }
                ]
              }
            ]
          })
        }
      );
      
      const data = await response.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      console.error("Lỗi khi kết nối Google Gemini API:", err);
    }
  }

  // Fallback AI templates
  return getMockAIResponse(toolName, prompt);
}

function getToolInstruction(toolName: string): string {
  switch (toolName) {
    case "PROMPT_GEN":
      return "Hãy tối ưu hóa prompt thô của người dùng thành một prompt chuyên nghiệp, chi tiết cho Midjourney hoặc ChatGPT.";
    case "SEO_GEN":
      return "Tạo bộ tối ưu SEO bao gồm: Title chuẩn SEO, Meta Description cuốn hút, H1, danh sách H2 gợi ý, và 5 Focus Keywords.";
    case "CONTENT_WRITE":
      return "Viết một bài viết ngắn hoặc nội dung quảng cáo chất lượng cao dựa trên chủ đề của người dùng. Viết tự nhiên, cuốn hút.";
    case "TITLE_GEN":
      return "Tạo 10 tiêu đề bài viết giật tít (click-through rate cao) và hợp xu hướng liên quan đến chủ đề.";
    default:
      return "Trả lời câu hỏi của người dùng một cách thông thái và chuyên sâu.";
  }
}

function getMockAIResponse(toolName: string, prompt: string): string {
  const timeStr = new Date().toLocaleTimeString("vi-VN");
  switch (toolName) {
    case "PROMPT_GEN":
      return `### ⚡ PROMPT AI ĐÃ ĐƯỢC TỐI ƯU HÓA (MOCK AI - ${timeStr})

**Prompt gốc:** "${prompt}"

**Prompt cải tiến chuyên sâu:**
> "/imagine prompt: ${prompt}, hyper-realistic photography, cinematic lighting, volumetric smoke, extremely detailed, shot on 85mm lens, f/1.8, unreal engine 5 render, global illumination, highly polished, 8k resolution --ar 16:9 --v 6.0"

**Mẹo áp dụng:**
1. Sao chép đoạn prompt trên và dán trực tiếp vào Midjourney / Leonardo.ai.
2. Có thể đổi tham số \`--ar\` thành \`1:1\` nếu bạn muốn ảnh vuông cho mạng xã hội.`;

    case "SEO_GEN":
      return `### 🚀 BỘ TỐI ƯU SEO 2026 (MOCK AI - ${timeStr})

**Từ khóa chính:** "${prompt}"

1. **Title chuẩn SEO (Tối đa 60 ký tự):**
   * "${prompt} Là Gì? Hướng Dẫn Từng Bước Cho Người Mới Bắt Đầu [2026]"

2. **Meta Description (Tối đa 150 ký tự - Kích thích CTR):**
   * "Khám phá bí mật về ${prompt}. Bài viết hướng dẫn chi tiết cách triển khai, các mẹo tối ưu hiệu suất vượt trội cho doanh nghiệp của bạn."

3. **Hộp Cấu Trúc Heading (H1, H2, H3):**
   * **H1:** Hướng Dẫn Toàn Diện Về ${prompt} Từ A-Z
   * **H2:** Tại Sao ${prompt} Lại Quan Trọng Trong Năm 2026?
   * **H2:** Các Bước Triển Khai Thực Tế
   * **H3:** Bước 1: Chuẩn bị tài nguyên
   * **H3:** Bước 2: Tích hợp hệ thống
   * **H2:** Các lỗi thường gặp và giải pháp

4. **Danh Sách Focus Keywords Liên Quan:**
   * \`cách làm ${prompt}\`, \`hướng dẫn ${prompt}\`, \`công cụ ${prompt} tốt nhất\`, \`tối ưu hóa ${prompt} hiệu quả\`.`;

    case "CONTENT_WRITE":
      return `### ✍️ BÀI VIẾT NỘI DUNG SÁNG TẠO (MOCK AI - ${timeStr})

**Chủ đề:** "${prompt}"

---

Trong kỷ nguyên số hóa năm 2026, **${prompt}** đã và đang trở thành một trong những xu hướng then chốt định hình tương lai công nghệ và chuyển đổi số. Việc áp dụng đúng đắn kỹ thuật này mang lại lợi thế cạnh tranh vô cùng lớn.

#### 1. Lợi ích cốt lõi
* **Tự động hóa thông minh**: Tiết kiệm đến 70% thời gian xử lý thủ công.
* **Tối ưu chi phí**: Giảm thiểu sai sót của con người, tăng tính đồng bộ.
* **Mở rộng quy mô**: Dễ dàng nhân rộng hệ thống mà không cần thêm nhân sự cồng kềnh.

#### 2. Lời khuyên từ chuyên gia
Hãy bắt đầu với những mục tiêu nhỏ, đo lường kỹ chỉ số ROI (Return on Investment) và liên tục tối ưu hóa quy trình. Đừng ngần ngại sử dụng các công cụ AI hỗ trợ để gia tăng tốc độ triển khai.

---
*Hy vọng bài viết trên mang lại thông tin giá trị cho chiến dịch truyền thông sắp tới của bạn!*`;

    case "TITLE_GEN":
      return `### 🎯 TOP 10 TIÊU ĐỀ CLICK-THROUGH RATE CAO (MOCK AI - ${timeStr})

Dưới đây là các tiêu đề thu hút độc giả nhất về chủ đề **"${prompt}"**:

1. 🔥 **Sự thật về ${prompt} mà các chuyên gia không muốn bạn biết!**
2. 🚀 **Làm thế nào để làm chủ ${prompt} chỉ trong 7 ngày? (Hướng dẫn chi tiết)**
3. 💡 **Top 5 sai lầm tai hại khi triển khai ${prompt} và cách khắc phục**
4. 💸 **Kiếm $1000/tháng đơn giản bằng cách tận dụng sức mạnh của ${prompt}**
5. 🤖 **Tại sao ${prompt} sẽ thay đổi hoàn toàn cách bạn làm việc vào năm 2026?**
6. 🎯 **Bí quyết đột phá doanh số nhờ áp dụng ${prompt} đúng cách**
7. 📦 **Trọn bộ tài liệu tự học ${prompt} từ số 0 (Tải xuống miễn phí)**
8. ⚠️ **Cảnh báo: Đừng bắt đầu với ${prompt} trước khi đọc bài viết này!**
9. 💎 **10 Mẹo đỉnh cao để tối ưu hóa ${prompt} bạn nên thử ngay hôm nay**
10. 🌟 **Review chân thực: ${prompt} có thần thánh như lời đồn?**`;

    default:
      return `Đây là phản hồi giả lập từ trợ lý AI về chủ đề: "${prompt}". Bạn có thể cấu hình GEMINI_API_KEY trong tệp .env.local để nhận phản hồi từ mô hình AI thật của Google AI Studio.`;
  }
}

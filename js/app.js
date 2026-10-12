/* Personal Brain: ứng dụng thuần trình duyệt, dữ liệu được lưu trên thiết bị. */
(() => {
  'use strict';

  const STORAGE_KEY = 'personal-brain-v1';
  const defaultBookmarks = [
    { title: 'Gmail', url: 'https://mail.google.com/', icon: 'fa-envelope' },
    { title: 'YouTube', url: 'https://youtube.com/', icon: 'fa-play' },
    { title: 'Notion', url: 'https://notion.so/', icon: 'fa-book' },
    { title: 'GitHub', url: 'https://github.com/', icon: 'fa-code' }
  ];
  const defaultMemories = [
    { id: 'memory-1', title: 'Một ngày thật bình yên', date: '2025-08-18', category: 'Bản thân', description: 'Một buổi sáng chậm rãi, tách cà phê thơm và khoảng trời xanh — đôi khi bình yên là món quà quý nhất.', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80' },
    { id: 'memory-2', title: 'Chuyến đi để đời', date: '2025-04-12', category: 'Du lịch', description: 'Lưu lại những bước chân đầu tiên trên hành trình khám phá một miền đất mới.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
    { id: 'memory-3', title: 'Bữa tối cùng gia đình', date: '2025-01-29', category: 'Gia đình', description: 'Tiếng cười quanh bàn ăn là điều khiến mình thấy biết ơn nhất.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80' }
  ];
  const defaultNotes = [
    { id: 'note-1', title: 'Từ vựng tiếng Anh — những điều nhỏ bé', category: 'Ngôn ngữ', content: 'serendipity — tình cờ tìm thấy điều thú vị\\nresilience — khả năng phục hồi\\n\\nHọc một ít mỗi ngày sẽ tạo nên khác biệt lớn.', tags: ['flashcard', 'tiếng Anh'], updated: '2025-10-02' },
    { id: 'note-2', title: 'Nguyên tắc tài chính cá nhân', category: 'Tài chính', content: '• Chi tiêu ít hơn số tiền kiếm được.\\n• Xây quỹ dự phòng trước khi đầu tư.\\n• Ưu tiên dài hạn, tránh quyết định theo cảm xúc.', tags: ['tài chính', 'thói quen'], updated: '2025-09-21' },
    { id: 'note-3', title: 'Một chút về lãi kép', category: 'Kinh tế', content: 'Lãi kép là phần lãi được tính trên cả vốn ban đầu và phần lãi đã tích lũy. Thời gian là yếu tố quan trọng nhất.', tags: ['flashcard', 'kinh tế'], updated: '2025-09-12' }
  ];
  const defaultNews = [
    { id: 'news-1', category: 'Công nghệ', title: 'Những xu hướng công nghệ định hình cách chúng ta làm việc', summary: 'Theo dõi những chuyển động mới trong trí tuệ nhân tạo, công cụ số và cách các nhóm cộng tác.', source: 'TechCrunch', url: 'https://techcrunch.com/' },
    { id: 'news-2', category: 'Kinh tế', title: 'Bức tranh kinh tế toàn cầu: những chỉ số cần quan tâm', summary: 'Cập nhật góc nhìn về thị trường, chính sách và các yếu tố tác động đến nền kinh tế.', source: 'Reuters', url: 'https://www.reuters.com/business/' },
    { id: 'news-3', category: 'Thế giới', title: 'Tin tức thế giới và những câu chuyện đáng chú ý hôm nay', summary: 'Góc nhìn đa chiều về các sự kiện quốc tế từ những hãng tin uy tín.', source: 'BBC News', url: 'https://www.bbc.com/news' },
    { id: 'news-4', category: 'Công nghệ', title: 'Đổi mới sáng tạo và tương lai của các sản phẩm số', summary: 'Khám phá sản phẩm mới, ý tưởng hay và những câu chuyện đứng sau ngành công nghệ.', source: 'VnExpress', url: 'https://vnexpress.net/so-hoa' },
    { id: 'news-5', category: 'Kinh tế', title: 'Nhịp sống thị trường và các câu chuyện kinh doanh', summary: 'Các phân tích và tin tức thị trường giúp bạn hiểu thêm về dòng chảy kinh doanh.', source: 'VnExpress', url: 'https://vnexpress.net/kinh-doanh' },
    { id: 'news-6', category: 'Thế giới', title: 'Những góc nhìn mới về thế giới quanh ta', summary: 'Các bài phân tích và tin tức quốc tế từ nhiều nguồn báo chí độc lập.', source: 'Reuters', url: 'https://www.reuters.com/world/' }
  ];
  const quotes = [
    ['Không cần nhìn thấy toàn bộ cầu thang, hãy bước lên bậc đầu tiên.', 'Martin Luther King Jr.'],
    ['Điều quan trọng không phải là đi nhanh, mà là không dừng lại.', 'Khuyết danh'],
    ['Bạn không cần phải hoàn hảo để bắt đầu, nhưng cần bắt đầu để trở nên tốt hơn.', 'Zig Ziglar'],
    ['Tương lai phụ thuộc vào những điều bạn làm hôm nay.', 'Mahatma Gandhi'],
    ['Hạnh phúc không phải là điều có sẵn. Nó đến từ hành động của bạn.', 'Dalai Lama XIV'],
    ['Mỗi ngày là một cơ hội để bắt đầu lại.', 'Khuyết danh']
  ];
  const initialState = { bookmarks: defaultBookmarks, memories: defaultMemories, notes: defaultNotes, transactions: [], stocks: [], savedNews: [], scratchpad: '', theme: 'dark' };
  let state = loadState();
  let memoryFilter = 'all';
  let newsFilter = 'Tất cả';
  let chart;
  let flashcards = [];
  let flashcardPosition = 0;
  let showingAnswer = false;
  let quoteIndex = -1;
  let timerInterval = null;
  let timerMode = 'focus';
  let remainingSeconds = 25 * 60;
  let audioContext = null;
  let activeSound = null;
  let masterGain = null;
  let lightboxMemories = [];
  let lightboxIndex = 0;
  let touchStartX = 0;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return structuredClone(initialState);
      return {
        ...structuredClone(initialState),
        ...saved,
        bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : structuredClone(defaultBookmarks),
        memories: Array.isArray(saved.memories) ? saved.memories : structuredClone(defaultMemories),
        notes: Array.isArray(saved.notes) ? saved.notes : structuredClone(defaultNotes),
        transactions: Array.isArray(saved.transactions) ? saved.transactions : [],
        stocks: Array.isArray(saved.stocks) ? saved.stocks : [],
        savedNews: Array.isArray(saved.savedNews) ? saved.savedNews : []
      };
    } catch (error) {
      console.error('Không thể đọc dữ liệu Personal Brain:', error);
      return structuredClone(initialState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Không thể lưu dữ liệu Personal Brain:', error);
      toast('Không thể lưu dữ liệu. Có thể bộ nhớ trình duyệt đã đầy.', true);
      return false;
    }
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const formatMoney = value => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' ₫';
  const dateValue = value => new Date(`${value}T12:00:00`);
  const formatDate = value => dateValue(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const toast = (message, error = false) => {
    const item = document.createElement('div');
    item.className = `toast${error ? ' error' : ''}`;
    item.textContent = message;
    $('#toast-region').append(item);
    setTimeout(() => item.remove(), 3300);
  };
  const emptyState = (icon, message) => `<div class="empty-state"><i class="${icon}"></i>${escapeHTML(message)}</div>`;

  function renderClock() {
    const now = new Date();
    $('#live-clock').textContent = now.toLocaleTimeString('vi-VN');
    $('#today-label').textContent = now.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });
    $('#clock-date').textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
    const hour = now.getHours();
    $('#greeting').innerHTML = `${hour < 11 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'} <span class="wave">✦</span>`;
  }

  function renderQuote() {
    const day = Math.floor(Date.now() / 86400000);
    if (quoteIndex < 0) quoteIndex = day % quotes.length;
    $('#daily-quote').textContent = `“${quotes[quoteIndex][0]}”`;
    $('#quote-author').textContent = `— ${quotes[quoteIndex][1]}`;
  }

  const weatherCodes = {
    0: ['Trời quang', 'fa-sun', '#fbbf24'], 1: ['Ít mây', 'fa-cloud-sun', '#fcd34d'], 2: ['Có mây rải rác', 'fa-cloud-sun', '#93c5fd'],
    3: ['Nhiều mây', 'fa-cloud', '#a5b4fc'], 45: ['Sương mù', 'fa-smog', '#cbd5e1'], 48: ['Sương mù', 'fa-smog', '#cbd5e1'],
    51: ['Mưa phùn nhẹ', 'fa-cloud-rain', '#67e8f9'], 53: ['Mưa phùn', 'fa-cloud-rain', '#67e8f9'], 55: ['Mưa phùn dày', 'fa-cloud-showers-heavy', '#67e8f9'],
    61: ['Mưa nhẹ', 'fa-cloud-rain', '#67e8f9'], 63: ['Mưa vừa', 'fa-cloud-showers-heavy', '#67e8f9'], 65: ['Mưa lớn', 'fa-cloud-showers-heavy', '#67e8f9'],
    71: ['Tuyết nhẹ', 'fa-snowflake', '#e0f2fe'], 73: ['Tuyết vừa', 'fa-snowflake', '#e0f2fe'], 75: ['Tuyết lớn', 'fa-snowflake', '#e0f2fe'],
    80: ['Mưa rào', 'fa-cloud-showers-heavy', '#67e8f9'], 81: ['Mưa rào vừa', 'fa-cloud-showers-heavy', '#67e8f9'], 82: ['Mưa rào lớn', 'fa-cloud-showers-heavy', '#67e8f9'],
    95: ['Dông', 'fa-cloud-bolt', '#c4b5fd'], 96: ['Dông có mưa đá', 'fa-cloud-bolt', '#c4b5fd'], 99: ['Dông mạnh', 'fa-cloud-bolt', '#c4b5fd']
  };

  async function refreshWeather() {
    const description = $('#weather-description');
    if (!navigator.geolocation) {
      description.textContent = 'Thiết bị không hỗ trợ vị trí';
      return;
    }
    description.textContent = 'Đang lấy vị trí...';
    navigator.geolocation.getCurrentPosition(async position => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`);
        if (!response.ok) throw new Error(`Weather API: ${response.status}`);
        const data = await response.json();
        const current = data.current;
        const [label, icon, color] = weatherCodes[current.weather_code] || ['Thời tiết hiện tại', 'fa-cloud', '#93c5fd'];
        $('#weather-temperature').textContent = `${Math.round(current.temperature_2m)}°`;
        description.textContent = label;
        $('#weather-symbol').innerHTML = `<i class="fa-solid ${icon}"></i>`;
        $('#weather-symbol').style.color = color;
        $('#weather-location').innerHTML = '<i class="fa-solid fa-location-dot"></i> Vị trí gần bạn';
      } catch (error) {
        console.error('Không thể tải thời tiết:', error);
        description.textContent = 'Không thể cập nhật lúc này';
      }
    }, error => {
      console.info('Chưa có quyền truy cập vị trí:', error.message);
      description.textContent = 'Cho phép vị trí để xem thời tiết';
    }, { timeout: 10000, maximumAge: 600000 });
  }

  function renderBookmarks() {
    $('#bookmark-list').innerHTML = state.bookmarks.length
      ? state.bookmarks.map((item, index) => `<a class="shortcut" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer"><button class="shortcut-remove" data-remove-bookmark="${index}" aria-label="Xóa lối tắt"><i class="fa-solid fa-xmark"></i></button><span class="shortcut-icon"><i class="fa-solid ${escapeHTML(item.icon)}"></i></span><span>${escapeHTML(item.title)}</span></a>`).join('')
      : emptyState('fa-solid fa-link', 'Thêm lối tắt đầu tiên của bạn.');
  }

  function renderMemories() {
    $('#memory-count').textContent = String(state.memories.length);
    const entries = state.memories.filter(item => memoryFilter === 'all' || item.category === memoryFilter)
      .sort((a, b) => b.date.localeCompare(a.date));
    if (!entries.length) {
      $('#memory-timeline').innerHTML = emptyState('fa-regular fa-images', 'Chưa có kỷ niệm trong chủ đề này.');
      return;
    }
    let year = '';
    $('#memory-timeline').innerHTML = entries.map((item, index) => {
      const currentYear = dateValue(item.date).getFullYear().toString();
      const yearHeader = currentYear !== year ? `<div class="memory-year">${currentYear}</div>` : '';
      year = currentYear;
      const date = dateValue(item.date);
      return `${yearHeader}<article class="memory-item"><div class="memory-date"><strong>${String(date.getDate()).padStart(2, '0')}</strong>${date.toLocaleDateString('vi-VN', { month: 'short' })}</div><div class="memory-card"><div class="memory-copy"><div class="memory-meta"><span>${date.toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', year: 'numeric' })}</span><span class="tag-pill">${escapeHTML(item.category)}</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description || '')}</p><div class="memory-actions"><button class="small-action" data-delete-memory="${escapeHTML(item.id)}"><i class="fa-regular fa-trash-can"></i> Xóa</button></div></div><img class="memory-image" src="${escapeHTML(item.image || 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80')}" alt="${escapeHTML(item.title)}" data-lightbox="${index}" loading="lazy"></div></article>`;
    }).join('');
    lightboxMemories = entries;
  }

  function renderNotes() {
    const query = $('#knowledge-search').value.trim().toLocaleLowerCase('vi');
    const category = $('#knowledge-category').value;
    const notes = state.notes.filter(note => (category === 'all' || note.category === category)
      && `${note.title} ${note.content} ${note.tags.join(' ')} ${note.category}`.toLocaleLowerCase('vi').includes(query))
      .sort((a, b) => b.updated.localeCompare(a.updated));
    const counts = state.notes.reduce((result, note) => { result[note.category] = (result[note.category] || 0) + 1; return result; }, {});
    $('#category-strip').innerHTML = Object.entries(counts).map(([name, count]) => `<span class="category-mini">${escapeHTML(name)}<strong>${count}</strong></span>`).join('');
    $('#notes-list').innerHTML = notes.length ? notes.map(note => `<article class="note-card"><div class="note-card-top"><span class="tag-pill">${escapeHTML(note.category)}</span><div class="note-actions"><span class="note-date">${formatDate(note.updated)}</span><button class="small-action" data-delete-note="${escapeHTML(note.id)}" aria-label="Xóa ghi chú"><i class="fa-regular fa-trash-can"></i></button></div></div><div class="note-content" data-note-content="${escapeHTML(note.id)}"><h3>${escapeHTML(note.title)}</h3><div class="note-preview">${escapeHTML(note.content)}</div></div><div class="note-tags">${note.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div></article>`).join('') : emptyState('fa-solid fa-magnifying-glass', query ? 'Không tìm thấy ghi chú phù hợp.' : 'Chưa có ghi chú. Hãy lưu kiến thức đầu tiên của bạn.');
    flashcards = state.notes.flatMap(note => note.tags.includes('flashcard') ? note.content.split('\n').filter(line => line.includes('—') || line.includes(':')).map(line => {
      const separator = line.includes('—') ? '—' : ':';
      const parts = line.split(separator);
      return { front: parts.shift().trim(), back: parts.join(separator).trim() };
    }) : []);
    renderFlashcard();
  }

  function renderFlashcard() {
    if (flashcardPosition >= flashcards.length) flashcardPosition = 0;
    const item = flashcards[flashcardPosition];
    $('#flashcard-front').textContent = item ? (showingAnswer ? item.back : item.front) : 'Chưa có thẻ';
    $('#flashcard-back').textContent = item ? (showingAnswer ? 'Nhấn để xem mặt trước.' : 'Nhấn vào thẻ để lật và xem đáp án.') : 'Thêm ghi chú có từ khóa “flashcard” và các dòng theo mẫu “Từ — nghĩa”.';
    $('#flashcard-index').textContent = `${flashcards.length ? flashcardPosition + 1 : 0} / ${flashcards.length}`;
    $('#flashcard').querySelector('span').textContent = showingAnswer ? 'MẶT SAU' : 'NHẤN ĐỂ LẬT THẺ';
  }

  const newsCatalog = defaultNews;
  function renderNews() {
    $('#saved-count').textContent = String(state.savedNews.length);
    const items = newsFilter === 'Đã lưu' ? newsCatalog.filter(item => state.savedNews.includes(item.id))
      : newsCatalog.filter(item => newsFilter === 'Tất cả' || item.category === newsFilter);
    $('#news-list').innerHTML = items.length ? items.map(item => {
      const saved = state.savedNews.includes(item.id);
      return `<article class="news-card"><div class="news-card-top"><span class="news-category">${escapeHTML(item.category)}</span><button class="icon-button news-save${saved ? ' saved' : ''}" data-save-news="${escapeHTML(item.id)}" title="${saved ? 'Bỏ lưu' : 'Lưu đọc sau'}" aria-label="${saved ? 'Bỏ lưu' : 'Lưu đọc sau'}"><i class="${saved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i></button></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.summary)}</p><div class="news-card-bottom"><span class="news-source">${escapeHTML(item.source)}</span><a class="news-read" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Đọc nguồn <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div></article>`;
    }).join('') : emptyState('fa-regular fa-bookmark', newsFilter === 'Đã lưu' ? 'Bạn chưa lưu bài viết nào để đọc sau.' : 'Không có bài viết thuộc chủ đề này.');
  }

  function renderFinance() {
    const income = state.transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expense = state.transactions.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    $('#income-total').textContent = formatMoney(income);
    $('#expense-total').textContent = formatMoney(expense);
    $('#balance-total').textContent = formatMoney(income - expense);
    renderTransactions();
    renderStocks();
    renderChart();
  }

  function renderTransactions() {
    const transactions = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));
    $('#transactions-list').innerHTML = transactions.length ? transactions.slice(0, 8).map(item => `<div class="transaction-row"><span class="transaction-icon ${item.type}"><i class="fa-solid ${item.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i></span><div><strong>${escapeHTML(item.title)}</strong><small>${item.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}</small></div><time>${formatDate(item.date)}</time><span class="transaction-amount ${item.type}">${item.type === 'income' ? '+' : '−'}${formatMoney(item.amount)}</span><button class="small-action" data-delete-transaction="${escapeHTML(item.id)}" aria-label="Xóa giao dịch"><i class="fa-regular fa-trash-can"></i></button></div>`).join('') : `<div class="transaction-empty">Chưa có giao dịch. Bắt đầu ghi lại thu nhập và chi tiêu của bạn.</div>`;
  }

  function renderStocks() {
    $('#watchlist').innerHTML = state.stocks.length ? state.stocks.map(stock => `<div class="stock-row"><span class="stock-icon">${escapeHTML(stock.symbol)}</span><span class="stock-copy"><strong>${escapeHTML(stock.name)}</strong><small>${escapeHTML(stock.symbol)}</small></span><span class="stock-price"><strong>${formatMoney(stock.price)}</strong><span class="${stock.change >= 0 ? 'up' : 'down'}">${stock.change >= 0 ? '+' : ''}${stock.change}%</span></span><button class="delete-stock" data-delete-stock="${escapeHTML(stock.id)}" aria-label="Xóa mã"><i class="fa-solid fa-xmark"></i></button></div>`).join('') : emptyState('fa-solid fa-chart-simple', 'Thêm mã cổ phiếu để tạo danh sách quan tâm.');
  }

  function renderChart() {
    const canvas = $('#finance-chart');
    if (!canvas || !window.Chart) return;
    const monthsCount = Number($('#chart-period').value);
    const now = new Date();
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    for (let offset = monthsCount - 1; offset >= 0; offset--) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const month = date.toLocaleDateString('vi-VN', { month: 'short' });
      labels.push(month.charAt(0).toUpperCase() + month.slice(1));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      incomeData.push(state.transactions.filter(item => item.type === 'income' && item.date.startsWith(key)).reduce((sum, item) => sum + item.amount, 0));
      expenseData.push(state.transactions.filter(item => item.type === 'expense' && item.date.startsWith(key)).reduce((sum, item) => sum + item.amount, 0));
    }
    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: 'line',
      data: { labels, datasets: [
        { label: 'Thu nhập', data: incomeData, borderColor: '#34d399', backgroundColor: '#34d39918', fill: true, tension: .38, pointRadius: 3, pointHoverRadius: 5 },
        { label: 'Chi tiêu', data: expenseData, borderColor: '#818cf8', backgroundColor: '#818cf818', fill: true, tension: .38, pointRadius: 3, pointHoverRadius: 5 }
      ] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' }, plugins: { legend: { position: 'bottom', labels: { color: '#9ba7bc', boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle', padding: 18, font: { family: 'Inter', size: 9 } } }, tooltip: { callbacks: { label: context => `${context.dataset.label}: ${formatMoney(context.raw)}` } } }, scales: { x: { grid: { display: false }, ticks: { color: '#8390a7', font: { size: 9 } }, border: { display: false } }, y: { beginAtZero: true, grid: { color: '#ffffff0a' }, ticks: { color: '#8390a7', font: { size: 8 }, callback: value => value >= 1000000 ? `${value / 1000000}tr` : value >= 1000 ? `${value / 1000}k` : value }, border: { display: false } } } }
    });
  }

  function activatePage(name) {
    if (!$(`#page-${name}`)) return;
    $$('.page-section').forEach(section => section.classList.toggle('active', section.id === `page-${name}`));
    $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === name));
    $('#page-breadcrumb').textContent = ({ dashboard: 'Tổng quan', memories: 'Kỷ niệm', knowledge: 'Tri thức', focus: 'Tập trung', finance: 'Tài chính', news: 'Bản tin' })[name];
    $('#sidebar').classList.remove('open');
    if (name === 'finance') setTimeout(renderChart, 40);
    if (name === 'knowledge') renderNotes();
    if (name === 'memories') renderMemories();
    if (name === 'news') renderNews();
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      if (!file.type.startsWith('image/')) return reject(new Error('Tệp đã chọn không phải ảnh.'));
      if (file.size > 1.5 * 1024 * 1024) return reject(new Error('Ảnh vượt quá giới hạn 1,5 MB.'));
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh đã chọn.'));
      reader.readAsDataURL(file);
    });
  }

  function openLightbox(index) {
    lightboxIndex = index;
    showLightboxImage();
    $('#lightbox-dialog').showModal();
  }

  function showLightboxImage() {
    const item = lightboxMemories[lightboxIndex];
    if (!item) return;
    $('#lightbox-image').src = item.image;
    $('#lightbox-image').alt = item.title;
    $('#lightbox-caption').textContent = `${item.title} · ${formatDate(item.date)}`;
  }

  function navigateLightbox(direction) {
    if (lightboxMemories.length < 2) return;
    lightboxIndex = (lightboxIndex + direction + lightboxMemories.length) % lightboxMemories.length;
    showLightboxImage();
  }

  function startPomodoro() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      $('#timer-start').innerHTML = '<i class="fa-solid fa-play"></i> Tiếp tục';
      return;
    }
    $('#timer-start').innerHTML = '<i class="fa-solid fa-pause"></i> Tạm dừng';
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerMode = timerMode === 'focus' ? 'break' : 'focus';
        remainingSeconds = Number(timerMode === 'focus' ? $('#focus-duration').value : $('#break-duration').value) * 60;
        $('#timer-mode').textContent = timerMode === 'focus' ? 'TẬP TRUNG' : 'NGHỈ NGẮN';
        $('#pomodoro-label').textContent = timerMode === 'focus' ? 'Đến giờ tập trung' : 'Giờ nghỉ ngơi';
        $('#timer-start').innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu';
        updateTimerDisplay();
        toast(timerMode === 'break' ? 'Hoàn thành phiên tập trung — nghỉ ngơi một chút nhé!' : 'Hết giờ nghỉ — sẵn sàng tập trung chưa?');
        if ('Notification' in window && Notification.permission === 'granted') new Notification('Personal Brain', { body: timerMode === 'break' ? 'Đến giờ nghỉ ngắn.' : 'Quay lại với phiên tập trung nhé.' });
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    $('#timer-display').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const total = Number(timerMode === 'focus' ? $('#focus-duration').value : $('#break-duration').value) * 60;
    const degrees = Math.max(0, Math.min(360, (1 - remainingSeconds / total) * 360));
    $('#timer-ring').style.background = `conic-gradient(#818cf8 ${degrees}deg,#252e48 ${degrees}deg,#252e48 360deg)`;
  }

  async function toggleSound(name) {
    if (activeSound === name) {
      if (activeSound.nodes) activeSound.nodes.forEach(node => { try { node.stop(); } catch (error) { console.info('Âm thanh đã dừng:', error.message); } });
      activeSound = null;
      $$('.sound-option').forEach(button => { button.classList.remove('active'); button.querySelector('.sound-toggle').innerHTML = '<i class="fa-solid fa-play"></i>'; });
      $('#sound-note').textContent = 'Âm thanh đã dừng.';
      return;
    }
    if (activeSound) await toggleSound(activeSound.name);
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      toast('Trình duyệt này không hỗ trợ Web Audio API.', true);
      return;
    }
    try {
      audioContext = audioContext || new AudioContextClass();
      await audioContext.resume();
      masterGain = audioContext.createGain();
      masterGain.gain.value = Number($('#sound-volume').value) / 100 * .35;
      masterGain.connect(audioContext.destination);
      const nodes = [];
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
      const channel = noiseBuffer.getChannelData(0);
      for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;
      const noise = audioContext.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const filter = audioContext.createBiquadFilter();
      const lowPass = audioContext.createBiquadFilter();
      const gain = audioContext.createGain();
      gain.gain.value = name === 'cafe' ? .16 : .2;
      filter.type = name === 'rain' ? 'highpass' : 'lowpass';
      filter.frequency.value = name === 'rain' ? 600 : name === 'ocean' ? 700 : 1200;
      lowPass.type = 'lowpass';
      lowPass.frequency.value = name === 'rain' ? 5500 : name === 'ocean' ? 1400 : 2400;
      noise.connect(filter).connect(lowPass).connect(gain).connect(masterGain);
      noise.start();
      nodes.push(noise);
      if (name === 'ocean' || name === 'cafe') {
        const oscillator = audioContext.createOscillator();
        const oscGain = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = name === 'ocean' ? 95 : 180;
        oscGain.gain.value = name === 'ocean' ? .035 : .012;
        oscillator.connect(oscGain).connect(masterGain);
        oscillator.start();
        nodes.push(oscillator);
      }
      activeSound = { name, nodes };
      $$('.sound-option').forEach(button => {
        const active = button.dataset.sound === name;
        button.classList.toggle('active', active);
        button.querySelector('.sound-toggle').innerHTML = `<i class="fa-solid fa-${active ? 'pause' : 'play'}"></i>`;
      });
      $('#sound-note').textContent = `Đang phát ${name === 'rain' ? 'tiếng mưa' : name === 'ocean' ? 'tiếng sóng biển' : 'không gian quán cà phê'} tổng hợp.`;
    } catch (error) {
      console.error('Không thể khởi tạo âm thanh:', error);
      toast('Không thể phát âm thanh. Hãy thử tải lại trang.', true);
    }
  }

  function bindForms() {
    $('#bookmark-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      state.bookmarks.push({ title: data.get('title').trim(), url: data.get('url').trim(), icon: data.get('icon') });
      if (saveState()) { renderBookmarks(); event.currentTarget.reset(); $('#bookmark-dialog').close(); toast('Đã thêm lối tắt.'); }
    });
    $('#memory-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      try {
        const image = await readImage(data.get('image'));
        const entry = { id: makeId('memory'), title: data.get('title').trim(), date: data.get('date'), category: data.get('category'), description: data.get('description').trim(), image: image || 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80' };
        state.memories.push(entry);
        if (saveState()) { form.reset(); $('#memory-dialog').close(); renderMemories(); toast('Đã lưu kỷ niệm.'); }
      } catch (error) { toast(error.message, true); }
    });
    $('#note-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      state.notes.push({ id: makeId('note'), title: data.get('title').trim(), category: data.get('category'), content: data.get('content').trim(), tags: data.get('tags').split(',').map(tag => tag.trim()).filter(Boolean), updated: new Date().toISOString().slice(0, 10) });
      if (saveState()) { event.currentTarget.reset(); $('#note-dialog').close(); renderNotes(); toast('Đã lưu ghi chú.'); }
    });
    $('#stock-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      state.stocks.push({ id: makeId('stock'), symbol: data.get('symbol').trim().toUpperCase(), name: data.get('name').trim(), price: Number(data.get('price')), change: Number(data.get('change')) });
      if (saveState()) { event.currentTarget.reset(); $('#stock-dialog').close(); renderStocks(); toast('Đã thêm mã theo dõi.'); }
    });
    $('#transaction-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      state.transactions.push({ id: makeId('transaction'), type: data.get('type'), title: data.get('title').trim(), amount: Number(data.get('amount')), date: data.get('date') });
      if (saveState()) { event.currentTarget.reset(); $('#transaction-dialog').close(); renderFinance(); toast('Đã lưu giao dịch.'); }
    });
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const pageLink = event.target.closest('[data-page], [data-page-link]');
      if (pageLink) { event.preventDefault(); activatePage(pageLink.dataset.page || pageLink.dataset.pageLink); history.replaceState(null, '', `#${pageLink.dataset.page || pageLink.dataset.pageLink}`); return; }
      const dialogButton = event.target.closest('[data-open-dialog]');
      if (dialogButton) {
        const dialog = $(`#${dialogButton.dataset.openDialog}`);
        if (dialogButton.dataset.openDialog === 'transaction-dialog') $('#transaction-form [name="date"]').value = new Date().toISOString().slice(0, 10);
        if (dialogButton.dataset.openDialog === 'memory-dialog') $('#memory-form [name="date"]').value = new Date().toISOString().slice(0, 10);
        if (dialog) dialog.showModal();
      }
      const removeBookmark = event.target.closest('[data-remove-bookmark]');
      if (removeBookmark) { event.preventDefault(); state.bookmarks.splice(Number(removeBookmark.dataset.removeBookmark), 1); saveState(); renderBookmarks(); }
      const deleteMemory = event.target.closest('[data-delete-memory]');
      if (deleteMemory) { state.memories = state.memories.filter(item => item.id !== deleteMemory.dataset.deleteMemory); saveState(); renderMemories(); }
      const lightbox = event.target.closest('[data-lightbox]');
      if (lightbox) openLightbox(Number(lightbox.dataset.lightbox));
      const deleteNote = event.target.closest('[data-delete-note]');
      if (deleteNote) { state.notes = state.notes.filter(item => item.id !== deleteNote.dataset.deleteNote); saveState(); renderNotes(); }
      const noteContent = event.target.closest('[data-note-content]');
      if (noteContent) {
        const note = state.notes.find(item => item.id === noteContent.dataset.noteContent);
        if (note) {
          const dialog = document.createElement('dialog');
          dialog.className = 'app-dialog';
          dialog.innerHTML = `<div class="dialog-heading"><div><span class="eyebrow">${escapeHTML(note.category)}</span><h2>${escapeHTML(note.title)}</h2></div><button class="icon-button" aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button></div><div class="note-preview" style="white-space:pre-wrap;max-height:none">${escapeHTML(note.content)}</div>`;
          document.body.append(dialog);
          dialog.querySelector('button').addEventListener('click', () => dialog.close());
          dialog.addEventListener('close', () => dialog.remove());
          dialog.showModal();
        }
      }
      const saveNews = event.target.closest('[data-save-news]');
      if (saveNews) {
        const id = saveNews.dataset.saveNews;
        state.savedNews = state.savedNews.includes(id) ? state.savedNews.filter(item => item !== id) : [...state.savedNews, id];
        saveState(); renderNews();
      }
      const deleteTransaction = event.target.closest('[data-delete-transaction]');
      if (deleteTransaction) { state.transactions = state.transactions.filter(item => item.id !== deleteTransaction.dataset.deleteTransaction); saveState(); renderFinance(); }
      const deleteStock = event.target.closest('[data-delete-stock]');
      if (deleteStock) { state.stocks = state.stocks.filter(item => item.id !== deleteStock.dataset.deleteStock); saveState(); renderStocks(); }
    });

    $('#memory-filters').addEventListener('click', event => {
      const chip = event.target.closest('[data-filter]');
      if (!chip) return;
      memoryFilter = chip.dataset.filter;
      $$('.filter-chip', $('#memory-filters')).forEach(item => item.classList.toggle('active', item === chip));
      renderMemories();
    });
    $('#news-filters').addEventListener('click', event => {
      const chip = event.target.closest('[data-news-filter]');
      if (!chip) return;
      newsFilter = chip.dataset.newsFilter;
      $$('.filter-chip', $('#news-filters')).forEach(item => item.classList.toggle('active', item === chip));
      renderNews();
    });
    $('#knowledge-search').addEventListener('input', renderNotes);
    $('#knowledge-category').addEventListener('change', renderNotes);
    $('#flashcard-toggle').addEventListener('click', () => {
      const panel = $('#flashcard-panel');
      panel.hidden = !panel.hidden;
      $('#flashcard-toggle').classList.toggle('button-primary', !panel.hidden);
      if (!panel.hidden) renderFlashcard();
    });
    $('#flashcard').addEventListener('click', () => { if (flashcards.length) { showingAnswer = !showingAnswer; renderFlashcard(); } });
    $('#flashcard-prev').addEventListener('click', () => { if (flashcards.length) { flashcardPosition = (flashcardPosition - 1 + flashcards.length) % flashcards.length; showingAnswer = false; renderFlashcard(); } });
    $('#flashcard-next').addEventListener('click', () => { if (flashcards.length) { flashcardPosition = (flashcardPosition + 1) % flashcards.length; showingAnswer = false; renderFlashcard(); } });
    $('#scratchpad').value = state.scratchpad;
    $('#scratch-count').textContent = `${state.scratchpad.length} ký tự`;
    $('#scratchpad').addEventListener('input', event => {
      state.scratchpad = event.target.value;
      $('#scratch-count').textContent = `${state.scratchpad.length} ký tự`;
      const indicator = $('#scratch-status');
      indicator.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Đang lưu...';
      clearTimeout(window.scratchSaveTimeout);
      window.scratchSaveTimeout = setTimeout(() => {
        if (saveState()) indicator.innerHTML = '<i class="fa-solid fa-check"></i> Đã lưu';
      }, 250);
    });
    $('#refresh-weather').addEventListener('click', refreshWeather);
    $('#new-quote').addEventListener('click', () => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      $('#daily-quote').textContent = `“${quotes[quoteIndex][0]}”`;
      $('#quote-author').textContent = `— ${quotes[quoteIndex][1]}`;
    });
    $('#menu-toggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
    document.addEventListener('click', event => {
      if (window.innerWidth <= 850 && $('#sidebar').classList.contains('open') && !event.target.closest('#sidebar, #menu-toggle')) $('#sidebar').classList.remove('open');
    });
    $('#chart-period').addEventListener('change', renderChart);
    $('#timer-start').addEventListener('click', startPomodoro);
    $('#timer-reset').addEventListener('click', () => {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null; timerMode = 'focus'; remainingSeconds = Number($('#focus-duration').value) * 60;
      $('#timer-mode').textContent = 'TẬP TRUNG'; $('#pomodoro-label').textContent = 'Đến giờ tập trung';
      $('#timer-start').innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu'; updateTimerDisplay();
    });
    $('#focus-duration').addEventListener('change', () => { if (timerMode === 'focus' && !timerInterval) { remainingSeconds = Number($('#focus-duration').value) * 60; updateTimerDisplay(); } });
    $('#break-duration').addEventListener('change', () => { if (timerMode === 'break' && !timerInterval) { remainingSeconds = Number($('#break-duration').value) * 60; updateTimerDisplay(); } });
    $$('.sound-option').forEach(button => button.addEventListener('click', () => toggleSound(button.dataset.sound)));
    $('#sound-volume').addEventListener('input', event => { if (masterGain && audioContext) masterGain.gain.setTargetAtTime(Number(event.target.value) / 100 * .35, audioContext.currentTime, .05); });
    $('#lightbox-close').addEventListener('click', () => $('#lightbox-dialog').close());
    $('#lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    $('#lightbox-next').addEventListener('click', () => navigateLightbox(1));
    $('#lightbox-dialog').addEventListener('click', event => { if (event.target === $('#lightbox-dialog')) $('#lightbox-dialog').close(); });
    $('#lightbox-dialog').addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
    $('#lightbox-dialog').addEventListener('touchend', event => {
      const difference = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(difference) > 50) navigateLightbox(difference > 0 ? -1 : 1);
    }, { passive: true });
    document.addEventListener('keydown', event => {
      if ($('#lightbox-dialog').open) {
        if (event.key === 'ArrowRight') navigateLightbox(1);
        if (event.key === 'ArrowLeft') navigateLightbox(-1);
      }
    });
    $('#theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      state.theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      $('#theme-toggle').innerHTML = `<i class="fa-regular fa-${state.theme === 'light' ? 'moon' : 'sun'}"></i>`;
      saveState();
      if ($('#page-finance').classList.contains('active')) renderChart();
    });
    $('#export-data').addEventListener('click', () => {
      const data = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url; link.download = `personal-brain-${new Date().toISOString().slice(0, 10)}.json`; link.click();
      URL.revokeObjectURL(url);
      toast('Đã tải xuống bản sao lưu dữ liệu.');
    });
    bindForms();
  }

  function initialize() {
    renderClock();
    setInterval(renderClock, 1000);
    renderQuote();
    renderBookmarks();
    renderMemories();
    renderNotes();
    renderNews();
    renderFinance();
    $('#scratchpad').value = state.scratchpad || '';
    if (state.theme === 'light') {
      document.body.classList.add('light-theme');
      $('#theme-toggle').innerHTML = '<i class="fa-regular fa-moon"></i>';
    }
    updateTimerDisplay();
    const route = location.hash.replace('#', '');
    activatePage(['dashboard', 'memories', 'knowledge', 'focus', 'finance', 'news'].includes(route) ? route : 'dashboard');
    bindEvents();
  }

  initialize();
})();

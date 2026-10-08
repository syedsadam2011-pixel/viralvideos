/* =========================
   SUPABASE CONNECTION
========================= */

const SUPABASE_URL = "https://sfxsxogvrxgwryzfjwae.supabase.co";
const SUPABASE_KEY = "sb_publishable_LwynvmUuZwIMwNrScrusAQ_vkJzfIvo";


/* =========================
   SEARCH
========================= */

function searchSite() {
  const input = document.getElementById("search");
  const query = input ? input.value.trim() : "";

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  alert(
    "Search: " +
    query +
    "\n\nSearch system will be connected to the database."
  );
}


/* =========================
   ADMIN LOGIN
========================= */

function adminLogin() {
  const usernameElement = document.getElementById("adminUsername");
  const passwordElement = document.getElementById("adminPassword");
  const status = document.getElementById("loginStatus");
  const dashboard = document.getElementById("adminDashboard");

  if (!usernameElement || !passwordElement || !status) {
    return;
  }

  const username = usernameElement.value.trim();
  const password = passwordElement.value.trim();

  /*
    DEMO ADMIN LOGIN

    Username: admin
    Password: admin123

    IMPORTANT:
    This is only a frontend demo login.
    Real secure admin authentication requires
    Supabase Auth/backend security.
  */

  if (username === "admin" && password === "admin123") {
    status.textContent = "✓ Login successful";
    status.style.color = "#55d98a";

    if (dashboard) {
      dashboard.style.display = "block";
    }

    alert("Admin login successful.");
  } else {
    status.textContent = "✕ Invalid username or password";
    status.style.color = "#ff6b6b";

    if (dashboard) {
      dashboard.style.display = "none";
    }
  }
}


/* =========================
   ADMIN SECTIONS
========================= */

function openAdminSection(sectionId) {
  const sections = document.querySelectorAll(".admin-form");

  sections.forEach(function(section) {
    section.classList.remove("active");
  });

  const selected = document.getElementById(sectionId);

  if (selected) {
    selected.classList.add("active");

    selected.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  updateManager(sectionId);
}


/* =========================
   ADMIN MANAGER
========================= */

function updateManager(sectionId) {
  const title = document.getElementById("managerTitle");
  const message = document.getElementById("managerMessage");
  const content = document.getElementById("managerContent");

  if (!title || !message || !content) {
    return;
  }

  const sections = {

    trendingManage: {
      title: "Manage Trending",
      message: "Manage the videos and content shown in Trending Now."
    },

    videoManage: {
      title: "Manage Videos",
      message: "View, edit or remove uploaded videos."
    },

    galleryManage: {
      title: "Manage Gallery",
      message: "Manage photos and gallery content."
    },

    categoryManage: {
      title: "Manage Categories",
      message: "Add, edit or remove video categories."
    },

    countryManage: {
      title: "Manage Countries",
      message: "Manage country sections and country-based content."
    },

    creatorManage: {
      title: "Manage Creators",
      message: "Manage creators and seller profiles."
    },

    userManage: {
      title: "Manage Users",
      message: "Manage registered users."
    },

    premiumManage: {
      title: "Manage Premium",
      message: "Manage premium content and subscriptions."
    },

    earningsManage: {
      title: "Earnings",
      message: "View creator and seller earnings."
    },

    paymentManage: {
      title: "Payments",
      message: "Manage payment information."
    },

    commentManage: {
      title: "Comments",
      message: "Manage user comments."
    },

    reportManage: {
      title: "Reports",
      message: "Review reported content and users."
    },

    adsManage: {
      title: "Advertisements",
      message: "Manage advertising areas."
    },

    analyticsManage: {
      title: "Analytics",
      message: "View website traffic and content statistics."
    },

    settingsManage: {
      title: "Website Settings",
      message: "Manage general website settings."
    },

    securityManage: {
      title: "Security",
      message: "Security controls will be connected to the backend."
    },

    backupManage: {
      title: "Backup",
      message: "Database backup functionality requires a backend."
    }
  };

  const data = sections[sectionId];

  if (data) {
    title.textContent = data.title;
    message.textContent = data.message;

    content.innerHTML =
      "<p>⚙️ This section is ready for Supabase backend integration.</p>";
  }
}


/* =========================
   VIDEO UPLOAD
========================= */

function uploadVideo() {
  const title = document.getElementById("videoTitle");
  const category = document.getElementById("videoCategory");
  const country = document.getElementById("videoCountry");
  const file = document.getElementById("videoFile");
  const description = document.getElementById("videoDescription");
  const status = document.getElementById("videoStatus");

  if (!title || !category || !country || !file || !description || !status) {
    return;
  }

  if (!title.value.trim()) {
    status.textContent = "Please enter a video title.";
    status.style.color = "#ff6b6b";
    return;
  }

  if (!category.value.trim()) {
    status.textContent = "Please enter a video category.";
    status.style.color = "#ff6b6b";
    return;
  }

  if (!file.files || file.files.length === 0) {
    status.textContent = "Please select a video file.";
    status.style.color = "#ff6b6b";
    return;
  }

  status.textContent =
    "✓ Video selected. Supabase storage connection is ready for the next setup step.";

  status.style.color = "#55d98a";

  console.log("Video:", {
    title: title.value,
    category: category.value,
    country: country.value,
    file: file.files[0].name,
    description: description.value
  });
}


/* =========================
   PHOTO UPLOAD
========================= */

function uploadPhoto() {
  const title = document.getElementById("photoTitle");
  const category = document.getElementById("photoCategory");
  const file = document.getElementById("photoFile");
  const description = document.getElementById("photoDescription");
  const status = document.getElementById("photoStatus");

  if (!title || !category || !file || !description || !status) {
    return;
  }

  if (!title.value.trim()) {
    status.textContent = "Please enter a photo title.";
    status.style.color = "#ff6b6b";
    return;
  }

  if (!file.files || file.files.length === 0) {
    status.textContent = "Please select a photo.";
    status.style.color = "#ff6b6b";
    return;
  }

  status.textContent =
    "✓ Photo selected. Supabase storage connection is ready for the next setup step.";

  status.style.color = "#55d98a";

  console.log("Photo:", {
    title: title.value,
    category: category.value,
    file: file.files[0].name,
    description: description.value
  });
}


/* =========================
   ARTICLE
========================= */

function addArticle() {
  const title = document.getElementById("articleTitle");
  const category = document.getElementById("articleCategory");
  const image = document.getElementById("articleImage");
  const content = document.getElementById("articleContent");
  const status = document.getElementById("articleStatus");

  if (!title || !category || !image || !content || !status) {
    return;
  }

  if (!title.value.trim()) {
    status.textContent = "Please enter an article title.";
    status.style.color = "#ff6b6b";
    return;
  }

  if (!category.value.trim()) {
    status.textContent = "Please enter an article category.";
    status.style.color = "#ff6b6b";
    return;
  }

  if (!content.value.trim()) {
    status.textContent = "Please enter article content.";
    status.style.color = "#ff6b6b";
    return;
  }

  status.textContent =
    "✓ Article created. Supabase database connection is ready for the next setup step.";

  status.style.color = "#55d98a";

  console.log("Article:", {
    title: title.value,
    category: category.value,
    image: image.value,
    content: content.value
  });
}


/* =========================
   DASHBOARD STATS
========================= */

function updateDashboardStats() {
  const stats = {
    totalVideos: 0,
    totalPhotos: 0,
    totalArticles: 0,
    totalCreators: 0,
    totalUsers: 0,
    totalReports: 0
  };

  Object.keys(stats).forEach(function(id) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = stats[id];
    }
  });
}


/* =========================
   ENTER KEY LOGIN
========================= */

document.addEventListener("DOMContentLoaded", function() {

  updateDashboardStats();

  const password = document.getElementById("adminPassword");

  if (password) {
    password.addEventListener("keydown", function(event) {

      if (event.key === "Enter") {
        adminLogin();
      }

    });
  }

});

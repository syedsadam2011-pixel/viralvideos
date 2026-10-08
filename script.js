/* =========================================================
   VIRALVIDEOS - SUPABASE
========================================================= */

const SUPABASE_URL = "https://sfxsxogvrxgwryzfjwae.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_LwynvmUuZwIMwNrScrusAQ_vkJzfIvo";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* =========================================================
   SEARCH
========================================================= */

function searchSite() {

  const input =
    document.getElementById("searchInput") ||
    document.getElementById("search");

  if (!input) return;

  const query = input.value.trim();

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  alert(
    "Search: " +
    query +
    "\n\nSearch system database se connect kiya jayega."
  );
}


/* =========================================================
   ADMIN LOGIN
========================================================= */

async function adminLogin() {

  const emailElement =
    document.getElementById("adminUsername");

  const passwordElement =
    document.getElementById("adminPassword");

  const status =
    document.getElementById("loginStatus");

  const loginSection =
    document.getElementById("adminLoginSection");

  const adminPanel =
    document.getElementById("adminPanel");

  if (!emailElement || !passwordElement || !status) {
    return;
  }

  const email = emailElement.value.trim();
  const password = passwordElement.value;

  if (!email) {
    status.textContent = "Please enter admin email.";
    status.style.color = "#ff6b6b";
    return;
  }

  if (!password) {
    status.textContent = "Please enter admin password.";
    status.style.color = "#ff6b6b";
    return;
  }

  status.textContent = "Logging in...";
  status.style.color = "#ffffff";

  try {

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

    if (error) {
      throw error;
    }

    if (!data.session) {
      throw new Error("Login session was not created.");
    }

    status.textContent = "✓ Login successful";
    status.style.color = "#55d98a";

    if (loginSection) {
      loginSection.style.display = "none";
    }

    if (adminPanel) {
      adminPanel.style.display = "block";
    }

    await updateDashboardStats();

  } catch (error) {

    console.error("Login error:", error);

    status.textContent =
      "✕ Login failed: " + error.message;

    status.style.color = "#ff6b6b";
  }
}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    alert("Logout failed.");
    return;
  }

  const loginSection =
    document.getElementById("adminLoginSection");

  const adminPanel =
    document.getElementById("adminPanel");

  if (loginSection) {
    loginSection.style.display = "block";
  }

  if (adminPanel) {
    adminPanel.style.display = "none";
  }

  const email =
    document.getElementById("adminUsername");

  const password =
    document.getElementById("adminPassword");

  if (email) email.value = "";
  if (password) password.value = "";

  alert("Admin logged out.");
}


/* =========================================================
   CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  const loginSection =
    document.getElementById("adminLoginSection");

  const adminPanel =
    document.getElementById("adminPanel");

  if (session) {

    if (loginSection) {
      loginSection.style.display = "none";
    }

    if (adminPanel) {
      adminPanel.style.display = "block";
    }

    await updateDashboardStats();

  } else {

    if (loginSection) {
      loginSection.style.display = "block";
    }

    if (adminPanel) {
      adminPanel.style.display = "none";
    }
  }
}


/* =========================================================
   ADMIN SECTIONS
========================================================= */

function openAdminSection(sectionId) {

  const sections =
    document.querySelectorAll(".admin-form");

  sections.forEach(function(section) {
    section.classList.remove("active");
  });

  const selected =
    document.getElementById(sectionId);

  if (selected) {

    selected.classList.add("active");

    selected.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  updateManager(sectionId);
}


/* =========================================================
   ADMIN MANAGER
========================================================= */

function updateManager(sectionId) {

  const title =
    document.getElementById("managerTitle");

  const message =
    document.getElementById("managerMessage");

  const content =
    document.getElementById("managerContent");

  if (!title || !message || !content) {
    return;
  }

  const sections = {

    trendingManage: {
      title: "Manage Trending",
      message:
        "Manage the videos and content shown in Trending Now."
    },

    videoManage: {
      title: "Manage Videos",
      message:
        "View, edit or remove uploaded videos."
    },

    galleryManage: {
      title: "Manage Gallery",
      message:
        "Manage photos and gallery content."
    },

    categoryManage: {
      title: "Manage Categories",
      message:
        "Add, edit or remove video categories."
    },

    countryManage: {
      title: "Manage Countries",
      message:
        "Manage country sections and country-based content."
    },

    creatorManage: {
      title: "Manage Creators",
      message:
        "Manage creators and seller profiles."
    },

    userManage: {
      title: "Manage Users",
      message:
        "Manage registered users."
    },

    premiumManage: {
      title: "Manage Premium",
      message:
        "Manage premium content and subscriptions."
    },

    earningsManage: {
      title: "Earnings",
      message:
        "View creator and seller earnings."
    },

    paymentManage: {
      title: "Payments",
      message:
        "Manage payment information."
    },

    commentManage: {
      title: "Comments",
      message:
        "Manage user comments."
    },

    reportManage: {
      title: "Reports",
      message:
        "Review reported content and users."
    },

    adsManage: {
      title: "Advertisements",
      message:
        "Manage advertising areas."
    },

    analyticsManage: {
      title: "Analytics",
      message:
        "View website traffic and content statistics."
    },

    settingsManage: {
      title: "Website Settings",
      message:
        "Manage general website settings."
    },

    securityManage: {
      title: "Security",
      message:
        "Security controls will be connected to the backend."
    },

    backupManage: {
      title: "Backup",
      message:
        "Database backup functionality requires a backend."
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


/* =========================================================
   VIDEO UPLOAD
========================================================= */

async function uploadVideo() {

  const title =
    document.getElementById("videoTitle");

  const category =
    document.getElementById("videoCategory");

  const country =
    document.getElementById("videoCountry");

  const fileInput =
    document.getElementById("videoFile");

  const description =
    document.getElementById("videoDescription");

  const status =
    document.getElementById("videoStatus");


  if (
    !title ||
    !category ||
    !country ||
    !fileInput ||
    !description ||
    !status
  ) {
    return;
  }


  /* ---------- VALIDATION ---------- */

  if (!title.value.trim()) {
    status.textContent =
      "Please enter a video title.";

    status.style.color = "#ff6b6b";
    return;
  }


  if (!category.value.trim()) {
    status.textContent =
      "Please enter a video category.";

    status.style.color = "#ff6b6b";
    return;
  }


  if (!fileInput.files ||
      fileInput.files.length === 0) {

    status.textContent =
      "Please select a video file.";

    status.style.color = "#ff6b6b";
    return;
  }


  /* ---------- CHECK LOGIN ---------- */

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();


  if (!session) {

    status.textContent =
      "Please login as admin first.";

    status.style.color = "#ff6b6b";
    return;
  }


  /* ---------- FILE ---------- */

  const file =
    fileInput.files[0];


  /* ---------- FILE SIZE ---------- */

  const maxSize =
    100 * 1024 * 1024;

  if (file.size > maxSize) {

    status.textContent =
      "Video is too large. Maximum size is 100 MB.";

    status.style.color = "#ff6b6b";
    return;
  }


  /* ---------- UPLOAD START ---------- */

  status.textContent =
    "Uploading video... Please wait.";

  status.style.color = "#ffffff";


  try {

    /*
      Unique filename
    */

    const fileExtension =
      file.name.includes(".")
        ? file.name.split(".").pop()
        : "mp4";

    const safeTitle =
      title.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const fileName =
      Date.now() +
      "-" +
      safeTitle +
      "." +
      fileExtension;


    const filePath =
      "videos/" + fileName;


    /* ---------- SUPABASE STORAGE ---------- */

    const {
      data: uploadData,
      error: uploadError
    } =
      await supabaseClient.storage
        .from("videos")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
          }
        );


    if (uploadError) {
      throw uploadError;
    }


    /* ---------- PUBLIC URL ---------- */

    const {
      data: publicData
    } =
      supabaseClient.storage
        .from("videos")
        .getPublicUrl(filePath);


    const publicUrl =
      publicData.publicUrl;


    console.log(
      "Uploaded:",
      uploadData
    );

    console.log(
      "Public URL:",
      publicUrl
    );


    /* ---------- SUCCESS ---------- */

    status.textContent =
      "✓ Video uploaded successfully!";

    status.style.color = "#55d98a";


    /*
      Database insert will be connected
      after confirming your exact
      free_videos columns.
    */

    console.log("Video information:", {
      title: title.value.trim(),
      category: category.value.trim(),
      country: country.value.trim(),
      description: description.value.trim(),
      video_url: publicUrl,
      storage_path: filePath
    });


    /* ---------- CLEAR FORM ---------- */

    title.value = "";
    category.value = "";
    country.value = "";
    description.value = "";
    fileInput.value = "";


    await updateDashboardStats();


  } catch (error) {

    console.error(
      "Video upload error:",
      error
    );


    status.textContent =
      "✕ Upload failed: " +
      error.message;

    status.style.color = "#ff6b6b";
  }
}


/* =========================================================
   PHOTO UPLOAD
========================================================= */

async function uploadPhoto() {

  const title =
    document.getElementById("photoTitle");

  const category =
    document.getElementById("photoCategory");

  const fileInput =
    document.getElementById("photoFile");

  const description =
    document.getElementById("photoDescription");

  const status =
    document.getElementById("photoStatus");


  if (
    !title ||
    !category ||
    !fileInput ||
    !description ||
    !status
  ) {
    return;
  }


  if (!title.value.trim()) {

    status.textContent =
      "Please enter a photo title.";

    status.style.color = "#ff6b6b";
    return;
  }


  if (
    !fileInput.files ||
    fileInput.files.length === 0
  ) {

    status.textContent =
      "Please select a photo.";

    status.style.color = "#ff6b6b";
    return;
  }


  const {
    data: { session }
  } = await supabaseClient.auth.getSession();


  if (!session) {

    status.textContent =
      "Please login as admin first.";

    status.style.color = "#ff6b6b";
    return;
  }


  const file =
    fileInput.files[0];


  status.textContent =
    "Uploading photo...";

  status.style.color = "#ffffff";


  try {

    const extension =
      file.name.includes(".")
        ? file.name.split(".").pop()
        : "jpg";


    const safeTitle =
      title.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");


    const fileName =
      "photo-" +
      Date.now() +
      "-" +
      safeTitle +
      "." +
      extension;


    const filePath =
      "photos/" + fileName;


    const {
      error
    } =
      await supabaseClient.storage
        .from("videos")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
          }
        );


    if (error) {
      throw error;
    }


    const {
      data: publicData
    } =
      supabaseClient.storage
        .from("videos")
        .getPublicUrl(filePath);


    console.log(
      "Photo URL:",
      publicData.publicUrl
    );


    status.textContent =
      "✓ Photo uploaded successfully.";

    status.style.color = "#55d98a";


    title.value = "";
    category.value = "";
    description.value = "";
    fileInput.value = "";


  } catch (error) {

    console.error(
      "Photo upload error:",
      error
    );


    status.textContent =
      "✕ Upload failed: " +
      error.message;

    status.style.color = "#ff6b6b";
  }
}


/* =========================================================
   ARTICLE
========================================================= */

function addArticle() {

  const title =
    document.getElementById("articleTitle");

  const category =
    document.getElementById("articleCategory");

  const content =
    document.getElementById("articleContent");

  const status =
    document.getElementById("articleStatus");


  if (!title || !category || !content || !status) {
    return;
  }


  if (!title.value.trim()) {

    status.textContent =
      "Please enter an article title.";

    status.style.color = "#ff6b6b";
    return;
  }


  if (!category.value.trim()) {

    status.textContent =
      "Please enter an article category.";

    status.style.color = "#ff6b6b";
    return;
  }


  if (!content.value.trim()) {

    status.textContent =
      "Please enter article content.";

    status.style.color = "#ff6b6b";
    return;
  }


  status.textContent =
    "✓ Article ready for database integration.";

  status.style.color = "#55d98a";


  console.log("Article:", {

    title:
      title.value.trim(),

    category:
      category.value.trim(),

    content:
      content.value.trim()
  });
}


/* =========================================================
   DASHBOARD STATS
========================================================= */

async function updateDashboardStats() {

  try {

    const {
      count,
      error
    } =
      await supabaseClient
        .from("free_videos")
        .select("*", {
          count: "exact",
          head: true
        });


    if (error) {
      console.error(
        "Dashboard error:",
        error
      );
      return;
    }


    const videoCount =
      document.getElementById("videoCount");

    if (videoCount) {
      videoCount.textContent =
        count || 0;
    }


  } catch (error) {

    console.error(
      "Dashboard stats error:",
      error
    );
  }
}


/* =========================================================
   ENTER KEY LOGIN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    const password =
      document.getElementById(
        "adminPassword"
      );


    if (password) {

      password.addEventListener(
        "keydown",
        function(event) {

          if (event.key === "Enter") {
            adminLogin();
          }

        }
      );
    }


    await checkAdminSession();

  }
);

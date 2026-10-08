/* =========================================================
   VIRALVIDEOS - SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://sfxsxogvrxgwryzfjwae.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_LwynvmUuZwIMwNrScrusAQ_vkJzfIvo";

const vvSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   SECURITY / HTML
========================================================= */

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   SEARCH
========================================================= */

function searchSite() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const query =
        input.value.trim().toLowerCase();

    if (!query) {

        loadVideos();
        return;
    }

    loadVideos(query);
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

    if (!emailElement ||
        !passwordElement ||
        !status) {
        return;
    }

    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;

    if (!email) {

        status.textContent =
            "Please enter admin email.";

        status.style.color =
            "#ff6b6b";

        return;
    }

    if (!password) {

        status.textContent =
            "Please enter admin password.";

        status.style.color =
            "#ff6b6b";

        return;
    }

    status.textContent =
        "Logging in...";

    try {

        const result =
            await vvSupabase.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (result.error) {
            throw result.error;
        }

        status.textContent =
            "✓ Login successful";

        status.style.color =
            "#55d98a";

        if (loginSection) {
            loginSection.style.display =
                "none";
        }

        if (adminPanel) {
            adminPanel.style.display =
                "block";
        }

        await updateDashboardStats();

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        status.textContent =
            "✕ Login failed: " +
            error.message;

        status.style.color =
            "#ff6b6b";
    }
}


/* =========================================================
   LOGOUT
========================================================= */

async function adminLogout() {

    try {

        const result =
            await vvSupabase.auth.signOut();

        if (result.error) {
            throw result.error;
        }

        const loginSection =
            document.getElementById(
                "adminLoginSection"
            );

        const adminPanel =
            document.getElementById(
                "adminPanel"
            );

        if (loginSection) {
            loginSection.style.display =
                "block";
        }

        if (adminPanel) {
            adminPanel.style.display =
                "none";
        }

    } catch (error) {

        alert(
            "Logout failed: " +
            error.message
        );
    }
}


/* =========================================================
   SESSION
========================================================= */

async function checkAdminSession() {

    try {

        const result =
            await vvSupabase.auth.getSession();

        if (result.error) {
            throw result.error;
        }

        const session =
            result.data.session;

        const loginSection =
            document.getElementById(
                "adminLoginSection"
            );

        const adminPanel =
            document.getElementById(
                "adminPanel"
            );

        if (session) {

            if (loginSection) {
                loginSection.style.display =
                    "none";
            }

            if (adminPanel) {
                adminPanel.style.display =
                    "block";
            }

        } else {

            if (loginSection) {
                loginSection.style.display =
                    "block";
            }

            if (adminPanel) {
                adminPanel.style.display =
                    "none";
            }
        }

    } catch (error) {

        console.error(
            "Session Error:",
            error
        );
    }
}


/* =========================================================
   UPLOAD VIDEO
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
        document.getElementById(
            "videoDescription"
        );

    const status =
        document.getElementById(
            "videoStatus"
        );

    if (!title ||
        !category ||
        !country ||
        !fileInput ||
        !description ||
        !status) {
        return;
    }

    if (!title.value.trim()) {

        status.textContent =
            "Please enter a video title.";

        return;
    }

    if (!category.value.trim()) {

        status.textContent =
            "Please enter a video category.";

        return;
    }

    if (!fileInput.files.length) {

        status.textContent =
            "Please select a video.";

        return;
    }

    const session =
        await vvSupabase.auth.getSession();

    if (!session.data.session) {

        status.textContent =
            "Please login as admin first.";

        return;
    }

    const file =
        fileInput.files[0];

    status.textContent =
        "Uploading video...";

    try {

        const extension =
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
            extension;

        const filePath =
            "videos/" + fileName;


        /* STORAGE */

        const upload =
            await vvSupabase.storage
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

        if (upload.error) {
            throw upload.error;
        }


        /* PUBLIC URL */

        const publicResult =
            vvSupabase.storage
                .from("videos")
                .getPublicUrl(filePath);

        const videoUrl =
            publicResult.data.publicUrl;


        /* DATABASE */

        const database =
            await vvSupabase
                .from("free_videos")
                .insert({
                    title:
                        title.value.trim(),

                    category:
                        category.value.trim(),

                    country:
                        country.value.trim(),

                    description:
                        description.value.trim(),

                    video_url:
                        videoUrl,

                    storage_path:
                        filePath,

                    status:
                        "published"
                });

        if (database.error) {

            /* Remove uploaded file if database fails */

            await vvSupabase.storage
                .from("videos")
                .remove([filePath]);

            throw database.error;
        }


        status.textContent =
            "✓ Video uploaded successfully!";

        status.style.color =
            "#55d98a";


        title.value = "";
        category.value = "";
        country.value = "";
        description.value = "";
        fileInput.value = "";


        await updateDashboardStats();

        await loadVideos();

    } catch (error) {

        console.error(
            "Video Upload Error:",
            error
        );

        status.textContent =
            "✕ Upload failed: " +

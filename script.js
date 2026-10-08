/* =========================================================
   VIRALVIDEOS - FINAL SUPABASE SCRIPT
========================================================= */

const SUPABASE_URL =
    "https://sfxsxogvrxgwryzfjwae.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_LwynvmUuZwIMwNrScrusAQ_vkJzfIvo";

const ADMIN_UID =
    "d7a94992-6a9f-40fe-a923-280af7da0cf2";


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

let vvSupabase = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {

    vvSupabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

} else {

    console.error(
        "Supabase library load nahi hui."
    );
}


/* =========================================================
   SECURITY
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
   SUPABASE CHECK
========================================================= */

function requireSupabase() {

    if (vvSupabase) {
        return true;
    }

    const status =
        document.getElementById("loginStatus");

    if (status) {

        status.textContent =
            "✕ Supabase load nahi hui. Page refresh karein.";

        status.style.color =
            "#ff6b6b";
    }

    return false;
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

    loadVideos(query);
}

window.searchSite = searchSite;


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

        console.error(
            "Admin login HTML elements nahi mile."
        );

        return;
    }


    if (!requireSupabase()) {
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

    status.style.color =
        "#ffffff";


    try {

        const result =
            await vvSupabase.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (result.error) {
            throw result.error;
        }


        if (!result.data ||
            !result.data.user) {

            throw new Error(
                "User login nahi hua."
            );
        }


        if (
            result.data.user.id !==
            ADMIN_UID
        ) {

            await vvSupabase.auth.signOut();

            throw new Error(
                "Ye account admin account nahi hai."
            );
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
            (error.message ||
                "Unknown error");

        status.style.color =
            "#ff6b6b";
    }
}


window.adminLogin = adminLogin;


/* =========================================================
   LOGOUT
========================================================= */

async function adminLogout() {

    if (!requireSupabase()) {
        return;
    }

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


        const status =
            document.getElementById(
                "loginStatus"
            );


        if (status) {

            status.textContent =
                "Logged out.";
        }


    } catch (error) {

        alert(
            "Logout failed: " +
            error.message
        );
    }
}


window.adminLogout = adminLogout;


/* =========================================================
   SESSION CHECK
========================================================= */

async function checkAdminSession() {

    if (!vvSupabase) {
        return;
    }


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


        if (
            session &&
            session.user &&
            session.user.id === ADMIN_UID
        ) {

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

    if (!requireSupabase()) {
        return;
    }


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

        console.error(
            "Video upload fields missing."
        );

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


    try {

        const sessionResult =
            await vvSupabase.auth.getSession();


        if (sessionResult.error) {
            throw sessionResult.error;
        }


        const session =
            sessionResult.data.session;


        if (
            !session ||
            !session.user ||
            session.user.id !== ADMIN_UID
        ) {

            status.textContent =
                "Please login as admin first.";

            return;
        }


        const file =
            fileInput.files[0];


        status.textContent =
            "Uploading video...";

        status.style.color =
            "#ffffff";


        const extension =
            file.name.includes(".")
                ? file.name
                    .split(".")
                    .pop()
                    .toLowerCase()
                : "mp4";


        const safeTitle =
            title.value
                .trim()
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );


        const fileName =
            Date.now() +
            "-" +
            (safeTitle || "video") +
            "." +
            extension;


        const filePath =
            "videos/" + fileName;


        /* -------------------------
           STORAGE UPLOAD
        ------------------------- */

        const upload =
            await vvSupabase.storage
                .from("videos")
                .upload(
                    filePath,
                    file,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType:
                            file.type ||
                            "video/mp4"
                    }
                );


        if (upload.error) {
            throw upload.error;
        }


        /* -------------------------
           PUBLIC URL
        ------------------------- */

        const publicResult =
            vvSupabase.storage
                .from("videos")
                .getPublicUrl(
                    filePath
                );


        if (
            !publicResult.data ||
            !publicResult.data.publicUrl
        ) {

            throw new Error(
                "Video public URL nahi bana."
            );
        }


        const videoUrl =
            publicResult.data.publicUrl;


        /* -------------------------
           DATABASE
        ------------------------- */

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

            await vvSupabase.storage
                .from("videos")
                .remove([
                    filePath
                ]);

            throw database.error;
        }


        /* -------------------------
           SUCCESS
        ------------------------- */

        status.textContent =
            "✓ Video uploaded successfully!";

        status.style.color =
            "#55d98a";


        title.value = "";
        category.value = "";
        country.value = "";
        description.value = "";
        fileInput.value = "";


        await loadVideos();
        await updateDashboardStats();


    } catch (error) {

        console.error(
            "Video Upload Error:",
            error
        );

        status.textContent =
            "✕ Upload failed: " +
            (
                error.message ||
                "Unknown error"
            );

        status.style.color =
            "#ff6b6b";
    }
}


window.uploadVideo = uploadVideo;


/* =========================================================
   LOAD VIDEOS
========================================================= */

async function loadVideos(searchQuery = "") {

    const container =
        document.getElementById(
            "videoList"
        );


    if (!container) {
        return;
    }


    if (!vvSupabase) {

        container.innerHTML =
            "<p>Supabase load nahi hui.</p>";

        return;
    }


    try {

        const result =
            await vvSupabase
                .from("free_videos")
                .select(
                    "id,title,category,country,description,video_url,created_at"
                )
                .eq(
                    "status",
                    "published"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (result.error) {
            throw result.error;
        }


        let videos =
            result.data || [];


        if (searchQuery) {

            videos =
                videos.filter(
                    video => {

                        const text =
                            (
                                (video.title || "") +
                                " " +
                                (video.category || "") +
                                " " +
                                (video.country || "") +
                                " " +
                                (video.description || "")
                            ).toLowerCase();


                        return text.includes(
                            searchQuery
                        );
                    }
                );
        }


        if (!videos.length) {

            container.innerHTML =
                "<p>No videos available yet.</p>";

            return;
        }


        container.innerHTML =
            videos.map(
                video => `

                <div class="video-card">

                    <video
                        controls
                        preload="metadata"
                        width="100%"
                    >
                        <source
                            src="${escapeHtml(
                                video.video_url
                            )}"
                        >
                        Your browser does not
                        support video playback.
                    </video>

                    <h3>
                        ${escapeHtml(
                            video.title
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            video.category
                        )}
                        ${
                            video.country
                                ? " • " +
                                  escapeHtml(
                                      video.country
                                  )
                                : ""
                        }
                    </p>

                    ${
                        video.description
                            ? `<p>${escapeHtml(
                                video.description
                              )}</p>`
                            : ""
                    }

                </div>
            `
            ).join("");


    } catch (error) {

        console.error(
            "Load Videos Error:",
            error
        );

        container.innerHTML =
            "<p>Videos load nahi ho sake.</p>";
    }
}


/* =========================================================
   DASHBOARD STATS
========================================================= */

async function updateDashboardStats() {

    if (!vvSupabase) {
        return;
    }


    try {

        const result =
            await vvSupabase
                .from("free_videos")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                );


        const videoCount =
            document.getElementById(
                "videoCount"
            );


        if (videoCount) {

            videoCount.textContent =
                result.error
                    ? "0"
                    : String(
                        result.count || 0
                    );
        }


        const photoCount =
            document.getElementById(
                "photoCount"
            );

        const articleCount =
            document.getElementById(
                "articleCount"
            );


        if (photoCount) {

            photoCount.textContent =
                "0";
        }


        if (articleCount) {

            articleCount.textContent =
                "0";
        }


    } catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );
    }
}


/* =========================================================
   PHOTO / ARTICLE PLACEHOLDERS
========================================================= */

async function uploadPhoto() {

    alert(
        "Photo system baad mein activate hoga."
    );
}

window.uploadPhoto = uploadPhoto;


async function addArticle() {

    alert(
        "Article system baad mein activate hoga."
    );
}

window.addArticle = addArticle;


/* =========================================================
   START WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "ViralVideos JavaScript loaded successfully."
        );

        await checkAdminSession();

        await loadVideos();

        await updateDashboardStats();
    }
);

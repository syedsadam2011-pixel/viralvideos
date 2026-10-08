/* =========================================================
   VIRALVIDEOS - SUPABASE CONNECTION
========================================================= */

const SUPABASE_URL =
    "https://sfxsxogvrxgwryzfjwae.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_LwynvmUuZwIMwNrScrusAQ_vkJzfIvo";


/* =========================================================
   CREATE SUPABASE CLIENT
========================================================= */

const vvSupabase =
    window.supabase.createClient(
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

    const query =
        input.value.trim();

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
            !result.data.session) {

            throw new Error(
                "Login session was not created."
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
            "Admin Login Error:",
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
   ADMIN LOGOUT
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


        const email =
            document.getElementById(
                "adminUsername"
            );

        const password =
            document.getElementById(
                "adminPassword"
            );


        if (email) {
            email.value = "";
        }


        if (password) {
            password.value = "";
        }


    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );

        alert(
            "Logout failed: " +
            error.message
        );
    }
}


/* =========================================================
   CHECK LOGIN SESSION
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

            await updateDashboardStats();

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

        status.style.color =
            "#ff6b6b";

        return;
    }


    if (!category.value.trim()) {

        status.textContent =
            "Please enter a video category.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    if (!fileInput.files ||
        fileInput.files.length === 0) {

        status.textContent =
            "Please select a video file.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    const sessionResult =
        await vvSupabase.auth.getSession();


    if (!sessionResult.data.session) {

        status.textContent =
            "Please login as admin first.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    const file =
        fileInput.files[0];


    status.textContent =
        "Uploading video...";

    status.style.color =
        "#ffffff";


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


        const uploadResult =
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


        if (uploadResult.error) {
            throw uploadResult.error;
        }


        const publicResult =
            vvSupabase.storage
                .from("videos")
                .getPublicUrl(
                    filePath
                );


        const publicUrl =
            publicResult.data.publicUrl;


        console.log(
            "Video uploaded:",
            publicUrl
        );


        status.textContent =
            "✓ Video uploaded successfully.";

        status.style.color =
            "#55d98a";


        console.log({
            title:
                title.value.trim(),

            category:
                category.value.trim(),

            country:
                country.value.trim(),

            description:
                description.value.trim(),

            video_url:
                publicUrl,

            storage_path:
                filePath
        });


        title.value = "";
        category.value = "";
        country.value = "";
        description.value = "";
        fileInput.value = "";


        await updateDashboardStats();


    } catch (error) {

        console.error(
            "Video Upload Error:",
            error
        );


        status.textContent =
            "✕ Upload failed: " +
            error.message;

        status.style.color =
            "#ff6b6b";
    }
}


/* =========================================================
   PHOTO UPLOAD
========================================================= */

async function uploadPhoto() {

    const title =
        document.getElementById(
            "photoTitle"
        );

    const category =
        document.getElementById(
            "photoCategory"
        );

    const fileInput =
        document.getElementById(
            "photoFile"
        );

    const description =
        document.getElementById(
            "photoDescription"
        );

    const status =
        document.getElementById(
            "photoStatus"
        );


    if (!title ||
        !category ||
        !fileInput ||
        !description ||
        !status) {
        return;
    }


    if (!title.value.trim()) {

        status.textContent =
            "Please enter a photo title.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    if (!fileInput.files ||
        fileInput.files.length === 0) {

        status.textContent =
            "Please select a photo.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    const sessionResult =
        await vvSupabase.auth.getSession();


    if (!sessionResult.data.session) {

        status.textContent =
            "Please login as admin first.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    const file =
        fileInput.files[0];


    status.textContent =
        "Uploading photo...";

    status.style.color =
        "#ffffff";


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


        const uploadResult =
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


        if (uploadResult.error) {
            throw uploadResult.error;
        }


        const publicResult =
            vvSupabase.storage
                .from("videos")
                .getPublicUrl(
                    filePath
                );


        console.log(
            "Photo URL:",
            publicResult.data.publicUrl
        );


        status.textContent =
            "✓ Photo uploaded successfully.";

        status.style.color =
            "#55d98a";


        title.value = "";
        category.value = "";
        description.value = "";
        fileInput.value = "";


    } catch (error) {

        console.error(
            "Photo Upload Error:",
            error
        );


        status.textContent =
            "✕ Upload failed: " +
            error.message;

        status.style.color =
            "#ff6b6b";
    }
}


/* =========================================================
   ARTICLE
========================================================= */

function addArticle() {

    const title =
        document.getElementById(
            "articleTitle"
        );

    const category =
        document.getElementById(
            "articleCategory"
        );

    const content =
        document.getElementById(
            "articleContent"
        );

    const status =
        document.getElementById(
            "articleStatus"
        );


    if (!title ||
        !category ||
        !content ||
        !status) {
        return;
    }


    if (!title.value.trim()) {

        status.textContent =
            "Please enter an article title.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    if (!category.value.trim()) {

        status.textContent =
            "Please enter an article category.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    if (!content.value.trim()) {

        status.textContent =
            "Please enter article content.";

        status.style.color =
            "#ff6b6b";

        return;
    }


    status.textContent =
        "✓ Article is ready.";

    status.style.color =
        "#55d98a";
}


/* =========================================================
   DASHBOARD
========================================================= */

async function updateDashboardStats() {

    try {

        const result =
            await vvSupabase
                .from("free_videos")
                .select("*", {
                    count: "exact",
                    head: true
                });


        if (result.error) {

            console.error(
                "Dashboard Error:",
                result.error
            );

            return;
        }


        const videoCount =
            document.getElementById(
                "videoCount"
            );


        if (videoCount) {

            videoCount.textContent =
                result.count || 0;
        }


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );
    }
}


/* =========================================================
   PAGE START
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

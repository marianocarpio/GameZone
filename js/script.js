document.addEventListener("DOMContentLoaded", function () {



    function setupAccountNavigation() {

        const navbar =
            document.querySelector(".navbar-nav.ms-auto");

        if (!navbar) {
            return;
        }


        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();



        const excludedPages = [
            "login.html",
            "admin-login.html",
            "player-dashboard.html",
            "admin-dashboard.html"
        ];


        if (excludedPages.includes(currentPage)) {
            return;
        }



        document
            .querySelectorAll(".gamezone-auth-item")
            .forEach(function (item) {
                item.remove();
            });


        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "gamezone_current_user"
                ) || "null"
            );



        if (!currentUser) {

            const loginItem =
                document.createElement("li");

            loginItem.className =
                "nav-item gamezone-auth-item ms-lg-2";


            loginItem.innerHTML = `
                <a
                    href="login.html"
                    class="nav-link"
                >
                    Login
                </a>
            `;


            navbar.appendChild(loginItem);

            return;
        }



        if (currentUser.role === "player") {

            const dashboardItem =
                document.createElement("li");

            dashboardItem.className =
                "nav-item gamezone-auth-item ms-lg-2";


            dashboardItem.innerHTML = `
                <a
                    href="player-dashboard.html"
                    class="nav-link"
                >
                    Dashboard
                </a>
            `;


            navbar.appendChild(dashboardItem);

        }



        if (currentUser.role === "admin") {

            const dashboardItem =
                document.createElement("li");

            dashboardItem.className =
                "nav-item gamezone-auth-item ms-lg-2";


            dashboardItem.innerHTML = `
                <a
                    href="admin-dashboard.html"
                    class="nav-link"
                >
                    Admin Dashboard
                </a>
            `;


            navbar.appendChild(dashboardItem);

        }



        const logoutItem =
            document.createElement("li");

        logoutItem.className =
            "nav-item gamezone-auth-item ms-lg-2";


        const logoutButton =
            document.createElement("button");

        logoutButton.type = "button";

        logoutButton.className =
            "btn btn-danger btn-sm mt-1";

        logoutButton.textContent =
            "Logout";


        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "gamezone_current_user"
                );


                window.location.href =
                    "index.html";

            }
        );


        logoutItem.appendChild(
            logoutButton
        );


        navbar.appendChild(
            logoutItem
        );

    }


    setupAccountNavigation();



    const searchInput =
        document.getElementById("searchInput");

    const genreFilter =
        document.getElementById("genreFilter");

    const gameCards =
        document.querySelectorAll(".game-card");

    const noResults =
        document.getElementById("noResults");


    function filterGames() {

        if (
            !searchInput ||
            !genreFilter ||
            gameCards.length === 0
        ) {
            return;
        }


        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const selectedGenre =
            genreFilter.value;


        let visibleGames = 0;


        gameCards.forEach(function (card) {

            const gameName =
                card.dataset.name
                    ? card.dataset.name.toLowerCase()
                    : "";


            const gameGenre =
                card.dataset.genre
                    ? card.dataset.genre
                    : "";


            const matchesSearch =
                gameName.includes(searchText);


            const matchesGenre =
                selectedGenre === "all" ||
                gameGenre === selectedGenre;


            if (
                matchesSearch &&
                matchesGenre
            ) {

                card.style.display = "";

                visibleGames++;

            } else {

                card.style.display = "none";

            }

        });


        if (noResults) {

            noResults.style.display =
                visibleGames === 0
                    ? "block"
                    : "none";

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterGames
        );

    }


    if (genreFilter) {

        genreFilter.addEventListener(
            "change",
            filterGames
        );

    }



    const favoriteButtons =
        document.querySelectorAll(
            ".favorite-btn"
        );


    const savedFavorites =
        JSON.parse(
            localStorage.getItem(
                "gamezone_favorites"
            ) || "[]"
        );


    favoriteButtons.forEach(function (button) {

        const card =
            button.closest(".game-card");


        if (!card) {
            return;
        }


        const gameName =
            card.dataset.name;


        if (
            savedFavorites.includes(
                gameName
            )
        ) {

            button.classList.add(
                "favorited"
            );

            button.innerHTML =
                "♥ Favorited";

        }


        button.addEventListener(
            "click",
            function () {

                let favorites =
                    JSON.parse(
                        localStorage.getItem(
                            "gamezone_favorites"
                        ) || "[]"
                    );


                if (
                    favorites.includes(
                        gameName
                    )
                ) {

                    favorites =
                        favorites.filter(
                            function (name) {
                                return name !== gameName;
                            }
                        );


                    button.classList.remove(
                        "favorited"
                    );


                    button.innerHTML =
                        "♡ Favorite";

                } else {

                    favorites.push(
                        gameName
                    );


                    button.classList.add(
                        "favorited"
                    );


                    button.innerHTML =
                        "♥ Favorited";

                }


                localStorage.setItem(
                    "gamezone_favorites",
                    JSON.stringify(
                        favorites
                    )
                );

            }
        );

    });



    const newsFilter =
        document.getElementById(
            "newsFilter"
        );


    const newsCards =
        document.querySelectorAll(
            ".news-card"
        );


    const noNews =
        document.getElementById(
            "noNews"
        );


    function filterNews() {

        if (
            !newsFilter ||
            newsCards.length === 0
        ) {
            return;
        }


        const selectedCategory =
            newsFilter.value;


        let visibleNews = 0;


        newsCards.forEach(
            function (card) {

                const category =
                    card.dataset.category;


                if (
                    selectedCategory === "all" ||
                    category === selectedCategory
                ) {

                    card.style.display = "";

                    visibleNews++;

                } else {

                    card.style.display = "none";

                }

            }
        );


        if (noNews) {

            noNews.style.display =
                visibleNews === 0
                    ? "block"
                    : "none";

        }

    }


    if (newsFilter) {

        newsFilter.addEventListener(
            "change",
            filterNews
        );

    }



    const readMoreButtons =
        document.querySelectorAll(
            ".read-more-btn"
        );


    readMoreButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".news-card"
                        );


                    if (!card) {
                        return;
                    }


                    const details =
                        card.querySelector(
                            ".news-details"
                        );


                    if (!details) {
                        return;
                    }


                    const hidden =
                        window.getComputedStyle(
                            details
                        ).display === "none";


                    if (hidden) {

                        details.style.display =
                            "block";


                        button.textContent =
                            "Read Less ↑";

                    } else {

                        details.style.display =
                            "none";


                        button.textContent =
                            "Read More →";

                    }

                }
            );

        }
    );



    const registrationForm =
        document.getElementById(
            "registrationForm"
        );


    const tournamentChoice =
        document.getElementById(
            "tournamentChoice"
        );


    const registrationSection =
        document.getElementById(
            "registrationSection"
        );


    const registrationSuccess =
        document.getElementById(
            "registrationSuccess"
        );


    const registerButtons =
        document.querySelectorAll(
            ".register-btn"
        );


    registerButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const tournamentName =
                        button.dataset.tournament;


                    if (tournamentChoice) {

                        tournamentChoice.value =
                            tournamentName;

                    }


                    if (registrationSection) {

                        registrationSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        }
    );


    if (registrationForm) {

        registrationForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const gamerName =
                    document.getElementById(
                        "gamerName"
                    ).value.trim();


                const gamerEmail =
                    document.getElementById(
                        "gamerEmail"
                    ).value.trim();


                const selectedTournament =
                    document.getElementById(
                        "tournamentChoice"
                    ).value;


                const experience =
                    document.getElementById(
                        "experience"
                    ).value;


                const registration = {

                    gamerName:
                        gamerName,

                    gamerEmail:
                        gamerEmail,

                    tournament:
                        selectedTournament,

                    experience:
                        experience,

                    date:
                        new Date()
                            .toLocaleString()

                };


                const registrations =
                    JSON.parse(
                        localStorage.getItem(
                            "gamezone_tournament_registrations"
                        ) || "[]"
                    );


                registrations.push(
                    registration
                );


                localStorage.setItem(
                    "gamezone_tournament_registrations",
                    JSON.stringify(
                        registrations
                    )
                );


                if (registrationSuccess) {

                    registrationSuccess.innerHTML =
                        "✅ Your tournament registration has been submitted successfully!";


                    registrationSuccess.style.display =
                        "block";

                }


                registrationForm.reset();

            }
        );

    }



    const chatSection =
        document.getElementById(
            "chatSection"
        );


    const chatTitle =
        document.getElementById(
            "chatTitle"
        );


    const chatDescription =
        document.getElementById(
            "chatDescription"
        );


    const chatMessages =
        document.getElementById(
            "chatMessages"
        );


    const chatForm =
        document.getElementById(
            "chatForm"
        );


    const usernameInput =
        document.getElementById(
            "usernameInput"
        );


    const messageInput =
        document.getElementById(
            "messageInput"
        );


    const discussionButton =
        document.getElementById(
            "discussionButton"
        );


    const playersButton =
        document.getElementById(
            "playersButton"
        );


    const closeChatButton =
        document.getElementById(
            "closeChatButton"
        );


    let currentChatType =
        "general";


    const chatStorageKeys = {

        general:
            "gamezone_general_messages",

        players:
            "gamezone_players_messages"

    };


    function getChatMessages(type) {

        return JSON.parse(
            localStorage.getItem(
                chatStorageKeys[type]
            ) || "[]"
        );

    }


    function saveChatMessages(
        type,
        messages
    ) {

        localStorage.setItem(
            chatStorageKeys[type],
            JSON.stringify(messages)
        );

    }


    function displayChatMessages(type) {

        if (!chatMessages) {
            return;
        }


        const messages =
            getChatMessages(type);


        chatMessages.innerHTML =
            "";


        if (messages.length === 0) {

            const welcome =
                document.createElement(
                    "div"
                );


            welcome.className =
                "chat-message";


            const title =
                type === "general"
                    ? "GameZone"
                    : "GameZone";


            const text =
                type === "general"
                    ? "Welcome to the General Chat! 🎮"
                    : "Looking for teammates? Start a conversation here! 👥";


            welcome.innerHTML =
                "<strong>" +
                escapeHtml(title) +
                "</strong><br>" +
                escapeHtml(text);


            chatMessages.appendChild(
                welcome
            );


            return;
        }


        messages.forEach(
            function (item) {

                const messageElement =
                    document.createElement(
                        "div"
                    );


                messageElement.className =
                    "chat-message";


                messageElement.innerHTML =
                    "<strong>" +
                    escapeHtml(
                        item.username
                    ) +
                    "</strong><br>" +
                    escapeHtml(
                        item.message
                    ) +
                    "<br><small style='color:#64748b;'>" +
                    escapeHtml(
                        item.time || ""
                    ) +
                    "</small>";


                chatMessages.appendChild(
                    messageElement
                );

            }
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    function openChat(type) {

        currentChatType =
            type;


        if (!chatSection) {
            return;
        }


        chatSection.classList.remove(
            "d-none"
        );


        if (type === "general") {

            if (chatTitle) {

                chatTitle.textContent =
                    "General Chat";

            }


            if (chatDescription) {

                chatDescription.textContent =
                    "Talk about games and connect with other GameZone players.";

            }

        } else {

            if (chatTitle) {

                chatTitle.textContent =
                    "Find Players";

            }


            if (chatDescription) {

                chatDescription.textContent =
                    "Find teammates and connect with other gamers.";

            }

        }


        displayChatMessages(
            type
        );


        chatSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    if (discussionButton) {

        discussionButton.addEventListener(
            "click",
            function () {

                openChat(
                    "general"
                );

            }
        );

    }


    if (playersButton) {

        playersButton.addEventListener(
            "click",
            function () {

                openChat(
                    "players"
                );

            }
        );

    }


    if (closeChatButton) {

        closeChatButton.addEventListener(
            "click",
            function () {

                chatSection.classList.add(
                    "d-none"
                );

            }
        );

    }


    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const username =
                    usernameInput.value.trim();


                const message =
                    messageInput.value.trim();


                if (
                    !username ||
                    !message
                ) {
                    return;
                }


                const messages =
                    getChatMessages(
                        currentChatType
                    );


                messages.push({

                    username:
                        username,

                    message:
                        message,

                    time:
                        new Date()
                            .toLocaleTimeString(
                                [],
                                {
                                    hour:
                                        "2-digit",

                                    minute:
                                        "2-digit"
                                }
                            )

                });


                saveChatMessages(
                    currentChatType,
                    messages
                );


                displayChatMessages(
                    currentChatType
                );


                messageInput.value =
                    "";


                messageInput.focus();

            }
        );

    }



    const contactForm =
        document.getElementById(
            "contactForm"
        );


    const contactSuccess =
        document.getElementById(
            "contactSuccess"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "contactName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "contactEmail"
                    ).value.trim();


                const subject =
                    document.getElementById(
                        "contactSubject"
                    ).value.trim();


                const message =
                    document.getElementById(
                        "contactMessage"
                    ).value.trim();


                if (
                    !name ||
                    !email ||
                    !subject ||
                    !message
                ) {

                    return;

                }


                const contactMessage = {

                    name:
                        name,

                    email:
                        email,

                    subject:
                        subject,

                    message:
                        message,

                    date:
                        new Date()
                            .toLocaleString()

                };


                const savedMessages =
                    JSON.parse(
                        localStorage.getItem(
                            "gamezone_contact_messages"
                        ) || "[]"
                    );


                savedMessages.push(
                    contactMessage
                );


                localStorage.setItem(
                    "gamezone_contact_messages",
                    JSON.stringify(
                        savedMessages
                    )
                );


                contactForm.reset();


                if (contactSuccess) {

                    contactSuccess.innerHTML =
                        "✅ <strong>Your message has been submitted successfully!</strong>";


                    contactSuccess.style.display =
                        "block";


                    contactSuccess.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    }



    const registerForm =
        document.getElementById(
            "registerForm"
        );


    const registerMessage =
        document.getElementById(
            "registerMessage"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "registerName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "registerEmail"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "registerPassword"
                    ).value;


                if (
                    !name ||
                    !email ||
                    !password
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Please complete all registration fields.";


                        registerMessage.className =
                            "alert alert-danger auth-message";


                        registerMessage.classList.remove(
                            "d-none"
                        );

                    }

                    return;
                }


                const users =
                    JSON.parse(
                        localStorage.getItem(
                            "gamezone_users"
                        ) || "[]"
                    );


                const existingUser =
                    users.find(
                        function (user) {

                            return (
                                user.email
                                    .toLowerCase() ===
                                email
                                    .toLowerCase()
                            );

                        }
                    );


                if (existingUser) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "An account with this email already exists.";


                        registerMessage.className =
                            "alert alert-danger auth-message";


                        registerMessage.classList.remove(
                            "d-none"
                        );

                    }

                    return;

                }


                const newUser = {

                    name:
                        name,

                    email:
                        email,

                    password:
                        password,

                    role:
                        "player"

                };


                users.push(
                    newUser
                );


                localStorage.setItem(
                    "gamezone_users",
                    JSON.stringify(
                        users
                    )
                );


                if (registerMessage) {

                    registerMessage.textContent =
                        "Registration successful! You can now log in.";


                    registerMessage.className =
                        "alert alert-success auth-message";


                    registerMessage.classList.remove(
                        "d-none"
                    );

                }


                registerForm.reset();

            }
        );

    }



    const showRegister =
        document.getElementById(
            "showRegister"
        );


    const registerCard =
        document.getElementById(
            "registerCard"
        );


    if (
        showRegister &&
        registerCard
    ) {

        if (
            window.location.hash ===
            "#register"
        ) {

            registerCard.classList.remove(
                "d-none"
            );

        }


        showRegister.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                registerCard.classList.toggle(
                    "d-none"
                );

            }
        );

    }



    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const loginMessage =
        document.getElementById(
            "loginMessage"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "loginEmail"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "loginPassword"
                    ).value;


                const users =
                    JSON.parse(
                        localStorage.getItem(
                            "gamezone_users"
                        ) || "[]"
                    );


                const user =
                    users.find(
                        function (item) {

                            return (
                                item.email
                                    .toLowerCase() ===
                                email
                                    .toLowerCase() &&
                                item.password ===
                                password
                            );

                        }
                    );


                if (!user) {

                    if (loginMessage) {

                        loginMessage.textContent =
                            "Invalid email or password.";


                        loginMessage.className =
                            "alert alert-danger auth-message";


                        loginMessage.classList.remove(
                            "d-none"
                        );

                    }

                    return;

                }


                if (
                    user.role !==
                    "player"
                ) {

                    if (loginMessage) {

                        loginMessage.textContent =
                            "This account is not a player account.";


                        loginMessage.className =
                            "alert alert-danger auth-message";


                        loginMessage.classList.remove(
                            "d-none"
                        );

                    }

                    return;

                }


                localStorage.setItem(
                    "gamezone_current_user",
                    JSON.stringify(
                        user
                    )
                );


                window.location.href =
                    "player-dashboard.html";

            }
        );

    }



    const adminLoginForm =
        document.getElementById(
            "adminLoginForm"
        );


    const adminLoginMessage =
        document.getElementById(
            "adminLoginMessage"
        );


    if (adminLoginForm) {

        adminLoginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "adminEmail"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "adminPassword"
                    ).value;


                const adminEmail =
                    "admin@gamezone.com";


                const adminPassword =
                    "admin123";


                if (
                    email ===
                    adminEmail &&
                    password ===
                    adminPassword
                ) {

                    const adminUser = {

                        name:
                            "GameZone Admin",

                        email:
                            adminEmail,

                        role:
                            "admin"

                    };


                    localStorage.setItem(
                        "gamezone_current_user",
                        JSON.stringify(
                            adminUser
                        )
                    );


                    window.location.href =
                        "admin-dashboard.html";

                } else {

                    if (adminLoginMessage) {

                        adminLoginMessage.textContent =
                            "Invalid admin email or password.";


                        adminLoginMessage.className =
                            "alert alert-danger";


                        adminLoginMessage.classList.remove(
                            "d-none"
                        );

                    }

                }

            }
        );

    }



    const playerName =
        document.getElementById(
            "playerName"
        );


    const playerEmail =
        document.getElementById(
            "playerEmail"
        );


    if (
        playerName ||
        playerEmail
    ) {

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "gamezone_current_user"
                ) || "null"
            );


        if (
            !currentUser ||
            currentUser.role !==
            "player"
        ) {

            window.location.href =
                "login.html";

            return;

        }


        if (playerName) {

            playerName.textContent =
                currentUser.name;

        }


        if (playerEmail) {

            playerEmail.textContent =
                currentUser.email;

        }

    }



    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "gamezone_current_user"
                );


                window.location.href =
                    "login.html";

            }
        );

    }



    const adminName =
        document.getElementById(
            "adminName"
        );


    const playersTable =
        document.getElementById(
            "playersTable"
        );


    const contactMessagesTable =
        document.getElementById(
            "contactMessagesTable"
        );


    if (
        adminName ||
        playersTable ||
        contactMessagesTable
    ) {

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "gamezone_current_user"
                ) || "null"
            );


        if (
            !currentUser ||
            currentUser.role !==
            "admin"
        ) {

            window.location.href =
                "admin-login.html";

            return;

        }


        if (adminName) {

            adminName.textContent =
                currentUser.name;

        }


        function loadAdminDashboard() {

            const users =
                JSON.parse(
                    localStorage.getItem(
                        "gamezone_users"
                    ) || "[]"
                );


            const contactMessages =
                JSON.parse(
                    localStorage.getItem(
                        "gamezone_contact_messages"
                    ) || "[]"
                );


            const generalMessages =
                JSON.parse(
                    localStorage.getItem(
                        "gamezone_general_messages"
                    ) || "[]"
                );


            const playerMessages =
                JSON.parse(
                    localStorage.getItem(
                        "gamezone_players_messages"
                    ) || "[]"
                );


            const totalChatMessages =
                generalMessages.length +
                playerMessages.length;


            const totalPlayers =
                document.getElementById(
                    "totalPlayers"
                );


            const totalMessages =
                document.getElementById(
                    "totalMessages"
                );


            const totalChatMessagesElement =
                document.getElementById(
                    "totalChatMessages"
                );


            if (totalPlayers) {

                totalPlayers.textContent =
                    users.filter(
                        function (user) {
                            return user.role === "player";
                        }
                    ).length;

            }


            if (totalMessages) {

                totalMessages.textContent =
                    contactMessages.length;

            }


            if (totalChatMessagesElement) {

                totalChatMessagesElement.textContent =
                    totalChatMessages;

            }


            if (playersTable) {

                playersTable.innerHTML =
                    "";


                const playerUsers =
                    users.filter(
                        function (user) {

                            return (
                                user.role ===
                                "player"
                            );

                        }
                    );


                const noPlayers =
                    document.getElementById(
                        "noPlayers"
                    );


                if (
                    playerUsers.length ===
                    0
                ) {

                    if (noPlayers) {
                        noPlayers.style.display =
                            "block";
                    }

                } else {

                    if (noPlayers) {
                        noPlayers.style.display =
                            "none";
                    }


                    playerUsers.forEach(
                        function (
                            user,
                            index
                        ) {

                            const row =
                                document.createElement(
                                    "tr"
                                );


                            row.innerHTML =
                                "<td>" +
                                (index + 1) +
                                "</td>" +

                                "<td>" +
                                escapeHtml(
                                    user.name
                                ) +
                                "</td>" +

                                "<td>" +
                                escapeHtml(
                                    user.email
                                ) +
                                "</td>" +

                                "<td>" +
                                "<span class='badge bg-primary'>" +
                                "Player" +
                                "</span>" +
                                "</td>";


                            playersTable.appendChild(
                                row
                            );

                        }
                    );

                }

            }


            if (contactMessagesTable) {

                contactMessagesTable.innerHTML =
                    "";


                const noContactMessages =
                    document.getElementById(
                        "noContactMessages"
                    );


                if (
                    contactMessages.length ===
                    0
                ) {

                    if (noContactMessages) {

                        noContactMessages.style.display =
                            "block";

                    }

                } else {

                    if (noContactMessages) {

                        noContactMessages.style.display =
                            "none";

                    }


                    contactMessages.forEach(
                        function (
                            item,
                            index
                        ) {

                            const row =
                                document.createElement(
                                    "tr"
                                );


                            row.innerHTML =
                                "<td>" +
                                (index + 1) +
                                "</td>" +

                                "<td>" +
                                escapeHtml(
                                    item.name
                                ) +
                                "</td>" +

                                "<td>" +
                                escapeHtml(
                                    item.email
                                ) +
                                "</td>" +

                                "<td>" +
                                escapeHtml(
                                    item.subject
                                ) +
                                "</td>" +

                                "<td>" +
                                escapeHtml(
                                    item.message
                                ) +
                                "</td>" +

                                "<td>" +

                                "<button " +
                                "type='button' " +
                                "class='btn btn-danger btn-sm delete-contact' " +
                                "data-index='" +
                                index +
                                "'>" +

                                "Delete" +

                                "</button>" +

                                "</td>";


                            contactMessagesTable.appendChild(
                                row
                            );

                        }
                    );

                }


                const deleteButtons =
                    document.querySelectorAll(
                        ".delete-contact"
                    );


                deleteButtons.forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                const index =
                                    Number(
                                        button.dataset.index
                                    );


                                const messages =
                                    JSON.parse(
                                        localStorage.getItem(
                                            "gamezone_contact_messages"
                                        ) || "[]"
                                    );


                                messages.splice(
                                    index,
                                    1
                                );


                                localStorage.setItem(
                                    "gamezone_contact_messages",
                                    JSON.stringify(
                                        messages
                                    )
                                );


                                loadAdminDashboard();

                            }
                        );

                    }
                );

            }

        }


        loadAdminDashboard();


        const refreshAdminButton =
            document.getElementById(
                "refreshAdminButton"
            );


        if (refreshAdminButton) {

            refreshAdminButton.addEventListener(
                "click",
                function () {

                    loadAdminDashboard();

                }
            );

        }


        const adminLogoutButton =
            document.getElementById(
                "adminLogoutButton"
            );


        if (adminLogoutButton) {

            adminLogoutButton.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "gamezone_current_user"
                    );


                    window.location.href =
                        "admin-login.html";

                }
            );

        }

    }

});


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
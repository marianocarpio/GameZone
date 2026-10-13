document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "gamezone_contact_messages";

    let currentUser;

    try {

        currentUser = JSON.parse(
            localStorage.getItem("gamezone_current_user") || "null"
        );

    } catch (error) {

        currentUser = null;
    }


    if (
        !currentUser ||
        currentUser.role !== "player" ||
        !currentUser.email
    ) {
        return;
    }


    const container = document.querySelector(
        ".dashboard-content .container"
    );

    const accountStatus = container
        ? container.querySelector(".account-status")
        : null;


    if (!container || !accountStatus) {
        return;
    }



    const style = document.createElement("style");

    style.textContent = `
        .player-replies-section {
            margin-top: 32px;
            padding: 26px;
            background: #111827;
            border: 1px solid rgba(139, 92, 246, .22);
            border-radius: 16px;
        }

        .player-replies-heading {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }

        .player-replies-heading h2 {
            color: #fff;
            font-size: 1.5rem;
            font-weight: 800;
            margin: 0 0 7px;
        }

        .player-replies-heading p {
            color: #94a3b8;
            margin: 0;
            line-height: 1.55;
        }

        .player-replies-count {
            display: inline-block;
            padding: 6px 11px;
            white-space: nowrap;
            color: #c4b5fd;
            background: rgba(124, 58, 237, .13);
            border: 1px solid rgba(139, 92, 246, .25);
            border-radius: 999px;
            font-size: .8rem;
            font-weight: 700;
        }

        .player-reply-item {
            padding: 19px;
            margin-top: 14px;
            background: #080b16;
            border: 1px solid rgba(148, 163, 184, .14);
            border-radius: 12px;
        }

        .player-reply-item h3 {
            color: #fff;
            font-size: 1.05rem;
            font-weight: 700;
            margin: 0 0 8px;
            overflow-wrap: anywhere;
        }

        .player-reply-meta {
            color: #64748b;
            font-size: .78rem;
            margin-bottom: 14px;
        }

        .player-question-label,
        .player-admin-label {
            display: block;
            color: #a5b4fc;
            font-size: .78rem;
            font-weight: 800;
            letter-spacing: .35px;
            margin-bottom: 6px;
        }

        .player-question-text,
        .player-admin-reply-text {
            color: #cbd5e1;
            margin: 0;
            line-height: 1.65;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        .player-admin-response {
            padding: 14px;
            margin-top: 15px;
            border-radius: 10px;
            background: rgba(34, 197, 94, .08);
            border: 1px solid rgba(34, 197, 94, .22);
        }

        .player-admin-response.waiting {
            background: rgba(148, 163, 184, .06);
            border-color: rgba(148, 163, 184, .17);
        }

        .player-admin-response .player-admin-label {
            color: #86efac;
        }

        .player-admin-response.waiting .player-admin-label {
            color: #cbd5e1;
        }

        .player-replies-empty {
            padding: 28px 18px;
            text-align: center;
            border: 1px dashed #334155;
            border-radius: 12px;
            color: #94a3b8;
        }

        .player-replies-contact-link {
            display: inline-block;
            margin-top: 13px;
            padding: 9px 14px;
            border-radius: 8px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            text-decoration: none;
            font-size: .88rem;
            font-weight: 700;
        }

        .player-replies-contact-link:hover {
            color: white;
            filter: brightness(1.08);
        }

        @media (max-width: 576px) {
            .player-replies-section {
                padding: 19px;
            }

            .player-reply-item {
                padding: 15px;
            }
        }
    `;

    document.head.appendChild(style);

    const section = document.createElement("section");

    section.className = "player-replies-section";
    section.id = "playerRepliesSection";


    const heading = document.createElement("div");

    heading.className = "player-replies-heading";


    const headingText = document.createElement("div");


    const title = document.createElement("h2");

    title.textContent = "📨 My Questions & Admin Replies";


    const description = document.createElement("p");

    description.textContent =
        "See the questions you've sent through Contact and the replies from the GameZone admin.";


    headingText.append(title, description);


    const count = document.createElement("span");

    count.className = "player-replies-count";
    count.id = "playerRepliesCount";
    count.textContent = "0 questions";


    heading.append(headingText, count);


    const emailNote = document.createElement("p");

    emailNote.style.cssText =
        "color:#64748b;font-size:.82rem;margin:0 0 16px;overflow-wrap:anywhere;";

    emailNote.textContent =
        "Replies are matched to your registered account email: " +
        currentUser.email +
        ". When contacting GameZone, use this same email address.";


    const list = document.createElement("div");

    list.id = "playerRepliesList";


    section.append(heading, emailNote, list);

    container.insertBefore(section, accountStatus);

    function readMessages() {

        try {

            const parsed = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {

            return [];
        }
    }

    function appendTextBlock(
        parent,
        labelText,
        value,
        className
    ) {

        const block = document.createElement("div");


        const label = document.createElement("span");

        label.className =
            className === "player-admin-reply-text"
                ? "player-admin-label"
                : "player-question-label";

        label.textContent = labelText;


        const text = document.createElement("p");

        text.className = className;
        text.textContent = value || "";


        block.append(label, text);

        parent.appendChild(block);
    }

    function renderReplies() {

        const email = String(currentUser.email)
            .trim()
            .toLowerCase();


        const messages = readMessages()
            .filter(function (item) {

                return (
                    item &&
                    String(item.email || "")
                        .trim()
                        .toLowerCase() === email
                );

            })
            .reverse();


        list.replaceChildren();


        count.textContent =
            messages.length +
            (messages.length === 1 ? " question" : " questions");


        if (messages.length === 0) {

            const empty = document.createElement("div");

            empty.className = "player-replies-empty";

            empty.textContent =
                "You haven't submitted a contact question using your registered account email yet.";


            const link = document.createElement("a");

            link.href = "contact.html";
            link.className = "player-replies-contact-link";
            link.textContent = "Contact GameZone →";


            empty.appendChild(document.createElement("br"));
            empty.appendChild(link);

            list.appendChild(empty);

            return;
        }


        messages.forEach(function (item) {

            const card = document.createElement("article");

            card.className = "player-reply-item";


            const subject = document.createElement("h3");

            subject.textContent =
                item.subject || "Contact Message";


            const meta = document.createElement("div");

            meta.className = "player-reply-meta";

            meta.textContent = item.date
                ? "Submitted: " + item.date
                : "Submitted to GameZone";


            card.append(subject, meta);


            appendTextBlock(
                card,
                "YOUR QUESTION",
                item.message,
                "player-question-text"
            );


            const response = document.createElement("div");

            const reply =
                typeof item.adminReply === "string"
                    ? item.adminReply.trim()
                    : "";


            if (reply) {

                response.className = "player-admin-response";


                appendTextBlock(
                    response,
                    "✓ REPLY FROM GAMEZONE ADMIN",
                    reply,
                    "player-admin-reply-text"
                );


                if (item.replyDate) {

                    const replyMeta = document.createElement("div");

                    replyMeta.className = "player-reply-meta";
                    replyMeta.style.marginTop = "9px";
                    replyMeta.style.marginBottom = "0";

                    replyMeta.textContent =
                        "Admin replied: " + item.replyDate;

                    response.appendChild(replyMeta);
                }

            } else {

                response.className =
                    "player-admin-response waiting";


                const waitingLabel =
                    document.createElement("span");

                waitingLabel.className = "player-admin-label";

                waitingLabel.textContent =
                    "⌛ WAITING FOR ADMIN REPLY";


                const waitingText =
                    document.createElement("p");

                waitingText.className = "player-admin-reply-text";

                waitingText.textContent =
                    "Your question has been received. Check back here later for a reply.";


                response.append(waitingLabel, waitingText);
            }


            card.appendChild(response);

            list.appendChild(card);
        });
    }

    renderReplies();

    window.addEventListener("storage", function (event) {

        if (event.key === STORAGE_KEY) {
            renderReplies();
        }

    });

});

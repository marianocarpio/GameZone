document.addEventListener("DOMContentLoaded", function () {

    const messagesTableBody =
        document.getElementById("contactMessagesTable");

    if (!messagesTableBody) {
        return;
    }

    const messagesTable = messagesTableBody.closest("table");

    if (!messagesTable) {
        return;
    }

    const STORAGE_KEY = "gamezone_contact_messages";

    const style = document.createElement("style");

    style.textContent = `
        #contactMessagesTable .admin-reply-cell {
            min-width: 260px;
            width: 310px;
        }

        #contactMessagesTable .admin-reply-input {
            display: block;
            width: 100%;
            min-width: 230px;
            min-height: 84px;
            padding: 10px;
            resize: vertical;
            color: #f8fafc;
            background: #080b16;
            border: 1px solid #334155;
            border-radius: 8px;
            line-height: 1.45;
        }

        #contactMessagesTable .admin-reply-input:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, .15);
        }

        #contactMessagesTable .admin-reply-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }

        #contactMessagesTable .admin-reply-status {
            display: block;
            margin-top: 7px;
            color: #94a3b8;
            font-size: .78rem;
            line-height: 1.4;
            min-width: 180px;
        }

        #contactMessagesTable .admin-reply-status.saved {
            color: #86efac;
        }

        #contactMessagesTable .admin-reply-status.error {
            color: #fca5a5;
        }

        #contactMessagesTable .admin-reply-save {
            white-space: nowrap;
        }

        @media (max-width: 768px) {
            #contactMessagesTable .admin-reply-cell {
                min-width: 245px;
            }
        }
    `;

    document.head.appendChild(style);

    function readMessages() {
        try {
            const value = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(value) ? value : [];

        } catch (error) {
            return [];
        }
    }

    function ensureMessageIds() {

        const messages = readMessages();
        let changed = false;

        messages.forEach(function (message, index) {

            if (!message || typeof message !== "object") {

                messages[index] = {
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                };

                changed = true;
                message = messages[index];
            }

            if (!message.id) {

                message.id =
                    "gzmsg-" +
                    Date.now() +
                    "-" +
                    index +
                    "-" +
                    Math.random().toString(36).slice(2, 8);

                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(messages)
            );
        }

        return messages;
    }

    function ensureTableHeadings() {

        const headerRow = messagesTable.querySelector("thead tr");

        if (!headerRow) {
            return;
        }

        const firstHeader = headerRow.querySelector("th");

        if (
            !firstHeader ||
            firstHeader.textContent.trim() !== "#"
        ) {
            const numberHeader = document.createElement("th");

            numberHeader.textContent = "#";

            headerRow.insertBefore(
                numberHeader,
                headerRow.firstElementChild
            );
        }

        if (
            !headerRow.querySelector(
                "[data-admin-reply-heading='true']"
            )
        ) {
            const replyHeading = document.createElement("th");

            replyHeading.textContent = "Admin Reply";

            replyHeading.setAttribute(
                "data-admin-reply-heading",
                "true"
            );

            const actionHeader = Array.from(
                headerRow.querySelectorAll("th")
            ).find(function (heading) {
                return (
                    heading.textContent.trim().toLowerCase() ===
                    "action"
                );
            });

            if (actionHeader) {
                headerRow.insertBefore(
                    replyHeading,
                    actionHeader
                );
            } else {
                headerRow.appendChild(replyHeading);
            }
        }
    }

    function createReplyCell(row, message) {

        let replyCell = row.querySelector(".admin-reply-cell");

        if (!replyCell) {

            replyCell = document.createElement("td");

            replyCell.className = "admin-reply-cell";

            const actionCell = row.lastElementChild;

            if (actionCell) {
                row.insertBefore(replyCell, actionCell);
            } else {
                row.appendChild(replyCell);
            }
        }

        replyCell.replaceChildren();


        const replyInput = document.createElement("textarea");

        replyInput.className = "admin-reply-input";
        replyInput.maxLength = 2000;
        replyInput.rows = 3;

        replyInput.placeholder =
            "Write a reply to this player's question...";

        replyInput.setAttribute(
            "aria-label",
            "Admin reply to " + (message.name || "player")
        );

        replyInput.value =
            typeof message.adminReply === "string"
                ? message.adminReply
                : "";


        const actions = document.createElement("div");

        actions.className = "admin-reply-actions";


        const saveButton = document.createElement("button");

        saveButton.type = "button";
        saveButton.className =
            "btn btn-primary btn-sm admin-reply-save";

        saveButton.dataset.messageId = String(message.id);

        saveButton.textContent =
            message.adminReply
                ? "Update Reply"
                : "Save Reply";


        const status = document.createElement("span");

        status.className = "admin-reply-status";

        status.setAttribute("role", "status");

        status.textContent = message.adminReply
            ? "Reply saved" +
              (message.replyDate ? " · " + message.replyDate : "")
            : "No reply saved yet";

        if (message.adminReply) {
            status.classList.add("saved");
        }

        actions.appendChild(saveButton);

        replyCell.append(
            replyInput,
            actions,
            status
        );
    }

    function decorateRows() {

        ensureTableHeadings();

        const messages = ensureMessageIds();

        const rows = Array.from(
            messagesTableBody.querySelectorAll("tr")
        );

        rows.forEach(function (row, index) {

            const message = messages[index];

            if (!message) {
                return;
            }

            row.dataset.contactMessageId = String(message.id);

            createReplyCell(row, message);
        });
    }

    messagesTableBody.addEventListener(
        "click",
        function (event) {

            const button = event.target.closest(
                ".admin-reply-save"
            );

            if (
                !button ||
                !messagesTableBody.contains(button)
            ) {
                return;
            }

            const row = button.closest("tr");

            const replyCell =
                button.closest(".admin-reply-cell");

            const replyInput = replyCell
                ? replyCell.querySelector(".admin-reply-input")
                : null;

            const status = replyCell
                ? replyCell.querySelector(".admin-reply-status")
                : null;

            if (!row || !replyInput || !status) {
                return;
            }

            const replyText = replyInput.value.trim();

            if (replyText.length > 2000) {

                status.textContent =
                    "Replies must be 2,000 characters or fewer.";

                status.className =
                    "admin-reply-status error";

                return;
            }


            const messageId = button.dataset.messageId;

            const messages = ensureMessageIds();

            const message = messages.find(function (item) {
                return String(item.id) === String(messageId);
            });


            if (!message) {

                status.textContent =
                    "Message could not be found. Refresh the dashboard and try again.";

                status.className =
                    "admin-reply-status error";

                return;
            }


            message.adminReply = replyText;

            message.replyDate = replyText
                ? new Date().toLocaleString()
                : "";

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(messages)
            );


            if (replyText) {

                status.textContent =
                    "Reply saved and visible in the matching player's dashboard. " +
                    "Saved " + message.replyDate;

                status.className =
                    "admin-reply-status saved";

                button.textContent = "Update Reply";

            } else {

                status.textContent =
                    "Reply cleared. The player will see that no reply is available.";

                status.className =
                    "admin-reply-status";

                button.textContent = "Save Reply";
            }
        }
    );

    const observer = new MutationObserver(function () {
        decorateRows();
    });

    observer.observe(
        messagesTableBody,
        {
            childList: true
        }
    );

    decorateRows();

});

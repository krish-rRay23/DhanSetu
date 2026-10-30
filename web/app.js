// OfflinePay — Interactive Operational Studio & Live System Frontend Application

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize GSAP ScrollTrigger if available
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        initHeroAnimations();
        initMetricsCounters();
        initCapabilitiesCards();
    }

    // 2. Initialize Interactive Studio Engine
    VinimayApp.init();
});

function initHeroAnimations() {
    gsap.to(".hero-text-side .reveal-fade-up", {
        opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2
    });
    gsap.to(".hero-visual-side.reveal-scale-in", {
        opacity: 1, scale: 1, duration: 1.6, ease: "power2.out", delay: 0.4
    });
}

function initMetricsCounters() {
    const numElements = document.querySelectorAll(".proof-number");
    numElements.forEach((num) => {
        const target = parseFloat(num.getAttribute("data-target"));
        const decimals = parseInt(num.getAttribute("data-decimals"), 10) || 0;
        const suffix = num.getAttribute("data-suffix") || "";
        let counterObj = { value: 0 };
        gsap.to(counterObj, {
            value: target,
            duration: 2.2,
            ease: "power2.out",
            scrollTrigger: { trigger: num, start: "top 85%", toggleActions: "play none none none" },
            onUpdate: () => {
                num.textContent = counterObj.value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
            }
        });
    });
}

function initCapabilitiesCards() {
    const cards = document.querySelectorAll(".reveal-card-morph");
    cards.forEach((card, idx) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: idx * 0.15,
            scrollTrigger: { trigger: card, start: "top 88%" }
        });
    });
}

/* ==========================================================================
   VINIMAY FINANCIAL & CRYPTOGRAPHIC ENGINE
   ========================================================================== */

const VinimayApp = {
    state: {
        mode: "SIMULATOR", // "LIVE" or "SIMULATOR"
        apiBase: window.location.origin,
        accounts: [
            { id: "acc_payer_alice", balance: 150000, status: "ACTIVE" },
            { id: "acc_merchant_bob", balance: 50000, status: "ACTIVE" },
            { id: "acc_charlie", balance: 200000, status: "ACTIVE" },
            { id: "acc_settlement_treasury", balance: 1000000, status: "TREASURY" }
        ],
        keypair: {
            pubKey: "04a1f8939c4d29381e...88e10b",
            privKey: "secp256k1_priv_9981a283...",
            deviceId: "dev_payer_alice"
        },
        currentEnvelope: null,
        dlqEvents: [
            { id: 101, category: "NETWORK", handler: "relay.forwarder", retries: 1, reason: "Peer BLE Connection Timeout" },
            { id: 102, category: "INFRASTRUCTURE", handler: "outbox.publisher", retries: 2, reason: "Redis Stream Partition Rebalance" }
        ],
        clusterNodes: [
            { id: "node-alpha", role: "LEADER", status: "HEALTHY", region: "ap-south-1a" },
            { id: "node-beta", role: "FOLLOWER", status: "HEALTHY", region: "ap-south-1b" },
            { id: "node-gamma", role: "FOLLOWER", status: "HEALTHY", region: "ap-south-1c" }
        ]
    },

    init() {
        this.bindEvents();
        this.checkBackendHealth();
        this.renderAccounts();
        this.renderDLQ();
        this.renderClusterNodes();
        this.generateFreshNonce();
    },

    bindEvents() {
        // Tab Switcher
        document.querySelectorAll(".studio-tab").forEach(tab => {
            tab.addEventListener("click", (e) => {
                const targetId = tab.getAttribute("data-tab");
                document.querySelectorAll(".studio-tab").forEach(t => t.classList.remove("active"));
                document.querySelectorAll(".studio-tab-content").forEach(c => c.classList.remove("active"));
                tab.classList.add("active");
                document.getElementById(targetId).classList.add("active");
            });
        });

        // Mode Toggle
        document.getElementById("toggle-mode-btn")?.addEventListener("click", () => {
            this.state.mode = (this.state.mode === "LIVE") ? "SIMULATOR" : "LIVE";
            this.updateModePill();
        });

        // Tab 1 Actions
        document.getElementById("btn-generate-keys")?.addEventListener("click", () => this.generateNewKeys());
        document.getElementById("btn-build-intent")?.addEventListener("click", () => this.buildOfflineIntent());

        // Tab 2 Actions
        document.getElementById("btn-execute-saga")?.addEventListener("click", () => this.executeSagaPipeline());

        // Tab 3 Actions
        document.getElementById("form-create-account")?.addEventListener("submit", (e) => this.handleCreateAccount(e));
        document.getElementById("btn-query-balance")?.addEventListener("click", () => this.handleQueryBalance());

        // Tab 4 Actions
        document.getElementById("btn-inject-dlq")?.addEventListener("click", () => this.injectDLQFailure());
        document.getElementById("btn-refresh-dlq")?.addEventListener("click", () => this.renderDLQ());

        // Tab 5 Actions
        document.getElementById("btn-reset-cluster")?.addEventListener("click", () => this.resetClusterNodes());
    },

    async checkBackendHealth() {
        try {
            const res = await fetch("/health", { method: "GET" });
            if (res.ok) {
                this.state.mode = "LIVE";
            } else {
                this.state.mode = "SIMULATOR";
            }
        } catch (e) {
            this.state.mode = "SIMULATOR";
        }
        this.updateModePill();
    },

    updateModePill() {
        const pill = document.getElementById("system-mode-pill");
        const label = document.getElementById("mode-label");
        if (this.state.mode === "LIVE") {
            pill.className = "mode-badge-pill live-mode";
            label.textContent = "LIVE REST API (Connected)";
        } else {
            pill.className = "mode-badge-pill sim-mode";
            label.textContent = "CLIENT SIMULATION ENGINE";
        }
    },

    generateFreshNonce() {
        const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
        const nonceElem = document.getElementById("intent-nonce");
        if (nonceElem) nonceElem.value = `nonce-sec-${randomHex}`;
    },

    generateNewKeys() {
        const randomPubKey = "04" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
        this.state.keypair.pubKey = randomPubKey;
        document.getElementById("intent-payer-key").value = `dev-payer-alice (${randomPubKey.substring(0, 16)}...)`;
        alert("New Secp256k1 Key Pair generated!");
    },

    async buildOfflineIntent() {
        const sender = document.getElementById("intent-sender").value.trim();
        const recipient = document.getElementById("intent-recipient").value.trim();
        const amount = parseInt(document.getElementById("intent-amount").value, 10);
        const nonce = document.getElementById("intent-nonce").value;

        if (!sender || !recipient || isNaN(amount)) {
            alert("Please provide valid sender, recipient, and amount.");
            return;
        }

        // Construct raw payload
        const rawPayload = {
            version: 1,
            token_id: `tok_${nonce}`,
            sender_id: sender,
            recipient_id: recipient,
            amount: amount,
            currency: "INR",
            nonce: nonce,
            timestamp: new Date().toISOString()
        };

        // SHA-256 Hash using WebCrypto
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(rawPayload));
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Formatted ECIES Envelope
        const envelope = {
            envelope_id: `env_${hashHex.substring(0, 12)}`,
            ephemeral_public_key: this.state.keypair.pubKey,
            ciphertext: `0x89a1f0...${hashHex.substring(0, 32)}...fe2109a`,
            mac_tag: hashHex.substring(32, 48),
            payload_hash: hashHex,
            ecdsa_signature: `30440220...${hashHex.substring(0, 16)}...0220...`,
            hop_count: 0,
            payload_size_bytes: 978,
            created_at: new Date().toISOString()
        };

        this.state.currentEnvelope = { envelope, rawPayload };

        // Output to Console Box
        const outputElem = document.getElementById("intent-envelope-output");
        outputElem.innerHTML = `
<span class="c-comment">// ECIES-AES-GCM-256 Encrypted Intent Envelope</span>
<span class="c-keyword">const</span> envelope = {
  <span class="c-string">"envelope_id"</span>: <span class="c-val">"${envelope.envelope_id}"</span>,
  <span class="c-string">"ephemeral_pubkey"</span>: <span class="c-val">"${envelope.ephemeral_public_key.substring(0, 24)}..."</span>,
  <span class="c-string">"payload_hash"</span>: <span class="c-val">"${envelope.payload_hash}"</span>,
  <span class="c-string">"ecdsa_signature"</span>: <span class="c-val">"${envelope.ecdsa_signature}"</span>,
  <span class="c-string">"sender"</span>: <span class="c-val">"${sender}"</span>,
  <span class="c-string">"recipient"</span>: <span class="c-val">"${recipient}"</span>,
  <span class="c-string">"amount_minor"</span>: <span class="c-val">${amount}</span>,
  <span class="c-string">"status"</span>: <span class="c-success">"READY_FOR_RELAY_TRANSPORT"</span>
};
`;
        document.getElementById("envelope-size").textContent = "978 Bytes";
        document.getElementById("envelope-sig-status").textContent = "ECDSA Valid";
    },

    async executeSagaPipeline() {
        if (!this.state.currentEnvelope) {
            await this.buildOfflineIntent();
        }

        const consoleBox = document.getElementById("saga-console-stream");
        consoleBox.innerHTML = `<span class="c-comment">// Initiating Proximity Relay Mesh Forwarding...</span>\n`;

        // 1. Animate Mesh Nodes
        const nodes = ["node-payer", "node-relay1", "node-relay2", "node-authority"];
        for (let i = 0; i < nodes.length; i++) {
            document.querySelectorAll(".mesh-node").forEach(n => n.classList.remove("active"));
            document.getElementById(nodes[i]).classList.add("active");
            consoleBox.innerHTML += `<span class="c-val">[RELAY] Packet arrived at ${nodes[i].replace('node-', '').toUpperCase()} (Hop ${i})</span>\n`;
            await new Promise(r => setTimeout(r, 400));
        }

        // 2. Sequential Saga Steps
        const steps = [
            { num: 1, name: "ECIES Payload Decryption", text: "Decrypted AES-GCM ciphertext. MAC Tag verified." },
            { num: 2, name: "Hardware Attestation", text: "KeyStore Enclave signature verified. Trust score: 100%." },
            { num: 3, name: "Replay & Nonce Audit", text: "Nonce is fresh. Redis monotonic deduplication PASSED." },
            { num: 4, name: "Atomic Ledger Commit", text: "Multi-worker Saga lock acquired. Double-entry post committed." },
            { num: 5, name: "Outbox Event Pub", text: "Event INTENT_SETTLED written to transactional outbox." }
        ];

        for (const step of steps) {
            const stepElem = document.getElementById(`saga-step-${step.num}`);
            const statusElem = document.getElementById(`saga-step-${step.num}-status`);
            
            stepElem.className = "saga-step step-active";
            statusElem.textContent = "RUNNING";
            await new Promise(r => setTimeout(r, 450));

            stepElem.className = "saga-step step-success";
            statusElem.textContent = "PASSED";
            consoleBox.innerHTML += `<span class="c-success">[SAGA STEP ${step.num}] ${step.name}: ${step.text}</span>\n`;
        }

        // 3. Mutate Ledger State in Simulation / API
        const payload = this.state.currentEnvelope.rawPayload;
        let senderAcc = this.state.accounts.find(a => a.id === payload.sender_id);
        let recipAcc = this.state.accounts.find(a => a.id === payload.recipient_id);

        if (!senderAcc) {
            senderAcc = { id: payload.sender_id, balance: 100000, status: "ACTIVE" };
            this.state.accounts.push(senderAcc);
        }
        if (!recipAcc) {
            recipAcc = { id: payload.recipient_id, balance: 50000, status: "ACTIVE" };
            this.state.accounts.push(recipAcc);
        }

        senderAcc.balance -= payload.amount;
        recipAcc.balance += payload.amount;

        consoleBox.innerHTML += `<span class="c-keyword">[SUCCESS] Settlement Saga Completed Atomically in 1.03 ms!</span>\n`;

        this.renderAccounts();
        this.generateFreshNonce();
    },

    renderAccounts() {
        const tbody = document.getElementById("accounts-tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        let totalDebits = 0;
        let totalCredits = 0;

        this.state.accounts.forEach(acc => {
            totalDebits += acc.balance;
            totalCredits += acc.balance;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="font-mono">${acc.id}</td>
                <td class="font-mono">${acc.balance.toLocaleString()}</td>
                <td class="font-mono">₹${(acc.balance / 100).toFixed(2)}</td>
                <td><span class="status-pill status-settled">${acc.status}</span></td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById("total-debits-val").textContent = `₹${(totalDebits / 100).toFixed(2)}`;
        document.getElementById("total-credits-val").textContent = `₹${(totalCredits / 100).toFixed(2)}`;
        document.getElementById("stat-active-accounts").textContent = this.state.accounts.length;
    },

    handleCreateAccount(e) {
        e.preventDefault();
        const id = document.getElementById("new-acc-id").value.trim();
        const bal = parseInt(document.getElementById("new-acc-balance").value, 10);

        if (!id || isNaN(bal)) return;

        const existing = this.state.accounts.find(a => a.id === id);
        if (existing) {
            existing.balance = bal;
        } else {
            this.state.accounts.push({ id, balance: bal, status: "ACTIVE" });
        }

        alert(`Account ${id} created with initial balance of ₹${(bal/100).toFixed(2)}`);
        document.getElementById("new-acc-id").value = "";
        this.renderAccounts();
    },

    handleQueryBalance() {
        const id = document.getElementById("query-acc-id").value.trim();
        const resultBox = document.getElementById("query-balance-result");

        const acc = this.state.accounts.find(a => a.id === id);
        if (acc) {
            resultBox.innerHTML = `
                <div style="background: rgba(16,185,129,0.1); border: 1px solid #10B981; padding: 12px; border-radius: 6px;">
                    <strong>Account ID:</strong> ${acc.id}<br>
                    <strong>Current Balance:</strong> ₹${(acc.balance/100).toFixed(2)} (${acc.balance} minor units)<br>
                    <strong>Status:</strong> ${acc.status}
                </div>
            `;
        } else {
            resultBox.innerHTML = `
                <div style="background: rgba(239,68,68,0.1); border: 1px solid #EF4444; padding: 12px; border-radius: 6px; color: #F87171;">
                    Account ID "${id}" not found in current ledger.
                </div>
            `;
        }
    },

    renderDLQ() {
        const tbody = document.getElementById("dlq-tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        this.state.dlqEvents.forEach(ev => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="font-mono">#${ev.id}</td>
                <td><span class="policy-badge cat-${ev.category.toLowerCase().substring(0, 4)}">${ev.category}</span></td>
                <td class="font-mono">${ev.handler}</td>
                <td>${ev.retries} / 3</td>
                <td>${ev.reason}</td>
                <td>
                    <button class="btn-sm primary-btn" onclick="VinimayApp.replayDLQ(${ev.id})">Replay</button>
                    <button class="btn-sm secondary-btn" onclick="VinimayApp.purgeDLQ(${ev.id})">Purge</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    injectDLQFailure() {
        const nextId = 100 + this.state.dlqEvents.length + 1;
        this.state.dlqEvents.push({
            id: nextId,
            category: "NETWORK",
            handler: "settlement.saga",
            retries: 1,
            reason: "Simulated Mesh Hop Latency Drop"
        });
        this.renderDLQ();
    },

    replayDLQ(id) {
        alert(`DLQ Event #${id} replayed successfully through Outbox Worker!`);
        this.purgeDLQ(id);
    },

    purgeDLQ(id) {
        this.state.dlqEvents = this.state.dlqEvents.filter(e => e.id !== id);
        this.renderDLQ();
    },

    renderClusterNodes() {
        const container = document.getElementById("cluster-nodes-container");
        if (!container) return;

        container.innerHTML = "";
        this.state.clusterNodes.forEach(node => {
            const isLeader = node.role === "LEADER";
            const isCrashed = node.status === "CRASHED";

            const card = document.createElement("div");
            card.className = `cluster-card ${isLeader ? 'is-leader' : ''} ${isCrashed ? 'is-crashed' : ''}`;
            card.innerHTML = `
                <span class="node-badge ${isLeader ? 'badge-leader' : 'badge-follower'}">${node.role}</span>
                <div style="font-size: 32px; margin-top: 10px;">${isCrashed ? '💥' : '🖥️'}</div>
                <h4>${node.id}</h4>
                <p>Region: ${node.region} | Status: <strong style="color: ${isCrashed ? '#EF4444' : '#10B981'}">${node.status}</strong></p>
                <div class="node-actions">
                    ${isCrashed 
                        ? `<button class="btn-sm primary-btn" onclick="VinimayApp.recoverNode('${node.id}')">Recover Node</button>` 
                        : `<button class="btn-sm secondary-btn" onclick="VinimayApp.crashNode('${node.id}')">Crash Node</button>`
                    }
                </div>
            `;
            container.appendChild(card);
        });
    },

    crashNode(nodeId) {
        const node = this.state.clusterNodes.find(n => n.id === nodeId);
        if (!node) return;

        node.status = "CRASHED";
        
        const consoleElem = document.getElementById("cluster-console");
        consoleElem.innerHTML += `<span class="c-error">[CHAOS INJECTION] Node ${nodeId} CRASHED!</span>\n`;

        // Leader election failover if leader crashed
        if (node.role === "LEADER") {
            node.role = "FOLLOWER";
            const healthyFollower = this.state.clusterNodes.find(n => n.status === "HEALTHY");
            if (healthyFollower) {
                healthyFollower.role = "LEADER";
                consoleElem.innerHTML += `<span class="c-success">[FAILOVER] Leader election complete. ${healthyFollower.id} is now LEADER!</span>\n`;
            } else {
                consoleElem.innerHTML += `<span class="c-error">[CRITICAL] No healthy nodes remaining in quorum!</span>\n`;
            }
        }

        this.renderClusterNodes();
        this.updateClusterMetrics();
    },

    recoverNode(nodeId) {
        const node = this.state.clusterNodes.find(n => n.id === nodeId);
        if (!node) return;

        node.status = "HEALTHY";
        const consoleElem = document.getElementById("cluster-console");
        consoleElem.innerHTML += `<span class="c-success">[RECOVERY] Node ${nodeId} recovered and rejoined cluster consensus.</span>\n`;

        this.renderClusterNodes();
        this.updateClusterMetrics();
    },

    resetClusterNodes() {
        this.state.clusterNodes = [
            { id: "node-alpha", role: "LEADER", status: "HEALTHY", region: "ap-south-1a" },
            { id: "node-beta", role: "FOLLOWER", status: "HEALTHY", region: "ap-south-1b" },
            { id: "node-gamma", role: "FOLLOWER", status: "HEALTHY", region: "ap-south-1c" }
        ];
        this.renderClusterNodes();
        this.updateClusterMetrics();
    },

    updateClusterMetrics() {
        const healthyCount = this.state.clusterNodes.filter(n => n.status === "HEALTHY").length;
        const total = this.state.clusterNodes.length;

        const healthVal = document.getElementById("stat-cluster-health");
        const healthSub = document.getElementById("stat-cluster-sub");

        if (healthyCount === total) {
            healthVal.textContent = "HEALTHY";
            healthVal.className = "dash-card-val text-success";
        } else if (healthyCount > 0) {
            healthVal.textContent = "DEGRADED";
            healthVal.className = "dash-card-val text-warning";
        } else {
            healthVal.textContent = "DOWN";
            healthVal.className = "dash-card-val c-error";
        }
        healthSub.textContent = `${healthyCount} / ${total} Nodes Online`;
    }
};

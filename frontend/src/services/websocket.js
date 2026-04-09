// ═══════════════════════════════════════════════════════════════
//  EtherX Word — Real-time Collaboration (WebSocket)
//  Placeholder-ready: swap URL for y-websocket / Liveblocks / etc.
// ═══════════════════════════════════════════════════════════════

export class CollabSocket {
  constructor(docId, userId) {
    this.docId = docId; this.userId = userId;
    this.ws = null; this.handlers = {};
    this.retries = 0; this.maxRetries = 5;
    this.connected = false;
  }

  connect() {
    this.ws = new WebSocket(`ws://${location.host}/ws/doc/${this.docId}?uid=${this.userId}`);
    this.ws.onopen    = () => { this.connected = true;  this.retries = 0; this._emit('connected'); };
    this.ws.onmessage = (e) => { try { const m = JSON.parse(e.data); this._emit(m.type, m.payload); } catch {} };
    this.ws.onclose   = () => {
      this.connected = false; this._emit('disconnected');
      if (this.retries < this.maxRetries) setTimeout(() => this.connect(), 1000 * ++this.retries);
    };
    this.ws.onerror = (err) => this._emit('error', err);
  }

  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify({ type, payload }));
  }

  broadcastChange(delta)    { this.send('change',   { delta,   uid: this.userId }); }
  broadcastPresence(cursor) { this.send('presence', { cursor,  uid: this.userId }); }
  broadcastComment(comment) { this.send('comment',  { comment, uid: this.userId }); }

  on(event, fn)  { (this.handlers[event] ??= []).push(fn); return () => this.off(event, fn); }
  off(event, fn) { this.handlers[event] = (this.handlers[event] || []).filter((h) => h !== fn); }
  _emit(event, data) { (this.handlers[event] || []).forEach((fn) => fn(data)); }
  disconnect()   { this.ws?.close(); this.handlers = {}; }
}

let _instance = null;
export const initCollab  = (docId, uid) => { _instance?.disconnect(); _instance = new CollabSocket(docId, uid); _instance.connect(); return _instance; };
export const getCollab   = () => _instance;

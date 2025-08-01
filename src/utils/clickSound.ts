// Tạo tiếng click bằng Web Audio API
class ClickSoundGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Khởi tạo AudioContext khi cần thiết
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  // Tạo tiếng click cơ bản
  playClick(
    frequency: number = 800,
    duration: number = 0.1,
    volume: number = 0.1
  ) {
    if (!this.audioContext) return;

    // Resume context nếu bị suspended
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Kết nối các node
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Cấu hình oscillator
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );
    oscillator.type = "sine";

    // Cấu hình envelope (fade in/out)
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // Phát âm thanh
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Tiếng click cho số
  playNumberClick() {
    this.playClick(600, 0.08, 0.08);
  }

  // Tiếng click cho toán tử
  playOperatorClick() {
    this.playClick(400, 0.12, 0.12);
  }

  // Tiếng click cho hàm
  playFunctionClick() {
    this.playClick(500, 0.1, 0.1);
  }

  // Tiếng click cho nút đặc biệt
  playSpecialClick() {
    this.playClick(350, 0.15, 0.15);
  }
}

// Export singleton instance
export const clickSound = new ClickSoundGenerator();

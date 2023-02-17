import { App } from "./app";
import { Vector2D } from "./vector-2d";

export class Input {
  private static INSTANCE: Input;
  private keyMap: Map<string, boolean> = new Map();
  private keyPrevMap: Map<string, boolean> = new Map();
  private mouseDownMap: Map<number, boolean> = new Map();
  private mouse: Vector2D = new Vector2D(0, 0);

  private clientBound: Vector2D = new Vector2D(0, 0);

  private constructor() {
    this.initWithEventHandlers();

    const canvas = App.getInstance().getGameCanvas();
    canvas.element.getBoundingClientRect();

    this.clientBound = new Vector2D(
      canvas.element.getBoundingClientRect().left,
      canvas.element.getBoundingClientRect().top
    );
  }

  initWithEventHandlers() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  removeEventHandlers() {
    document.removeEventListener("keydown", this.onKeyDown.bind(this));
    document.removeEventListener("keyup", this.onKeyUp.bind(this));
    document.removeEventListener("mousedown", this.onMouseDown.bind(this));
    document.removeEventListener("mouseup", this.onMouseUp.bind(this));
    document.removeEventListener("mousemove", this.onMouseMove.bind(this));
  }

  update(): void {
    this.keyPrevMap = new Map(this.keyMap);
  }

  onKeyDown(e: KeyboardEvent) {
    this.keyMap.set(e.key, true);
  }

  onKeyUp(e: KeyboardEvent) {
    this.keyMap.set(e.key, false);
  }

  onMouseDown(e: MouseEvent) {
    this.mouseDownMap.set(e.button, true);
  }

  onMouseUp(e: MouseEvent) {
    this.mouseDownMap.set(e.button, false);
  }

  onMouseMove(e: MouseEvent) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  /**
   * 한 번 눌렀다가 떼는 경우
   * @param key
   * @returns
   */
  isKeyDown(key: string): boolean {
    const prev = this.keyPrevMap.get(key) ?? false;

    return !prev && (this.keyMap.get(key) ?? false);
  }

  isKeyPress(key: string): boolean {
    return this.keyMap.get(key) ?? false;
  }

  isKeyUp(key: string): boolean {
    return !this.isKeyDown(key);
  }

  isAnyKeyDown(): boolean {
    return Array.from<boolean>(this.keyMap.values()).some((v) => v);
  }

  isMouseDown(button: number): boolean {
    return this.mouseDownMap.get(button) ?? false;
  }

  isMouseUp(button: number): boolean {
    return !this.isMouseDown(button);
  }

  isAnyMouseDown(): boolean {
    return Array.from<boolean>(this.mouseDownMap.values()).some((v) => v);
  }

  getMouseX(): number {
    return this.mouse.x - this.clientBound.x;
  }

  getMouseY(): number {
    return this.mouse.y - this.clientBound.y;
  }

  static getInstance(): Input {
    if (!Input.INSTANCE) {
      Input.INSTANCE = new Input();
    }

    return Input.INSTANCE;
  }
}

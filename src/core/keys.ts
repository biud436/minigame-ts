/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 * @description
 * namespace로 처리하면 타입으로 사용할 수 없어서 타입스크립트 만의 장점을 잃는다.
 * 하지만 export const로 처리하면 Windows API와 비슷한 형태로 사용할 수 있다.
 */
export namespace Keys {
    export const VK_LEFT = "ArrowLeft";
    export const VK_RIGHT = "ArrowRight";
    export const VK_UP = "ArrowUp";
    export const VK_DOWN = "ArrowDown";
    export const VK_SHIFT = "Shift";
    export const VK_RETURN = "Enter";

    export const VK_CONTROL = "Control";
    export const VK_LCONTROL = "Control";
    export const VK_RCONTROL = "Control";
}

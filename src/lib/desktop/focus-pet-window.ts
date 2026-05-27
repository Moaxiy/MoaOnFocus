const FOCUS_PET_LABEL = "focus-pet";
const FOCUS_PET_SIZE = 196;

async function revealPetWindowWithJsApi() {
  try {
    const [{ WebviewWindow }, { LogicalSize }] =
      await Promise.all([
        import("@tauri-apps/api/webviewWindow"),
        import("@tauri-apps/api/window"),
      ]);
    const petWindow = await WebviewWindow.getByLabel(FOCUS_PET_LABEL);

    if (!petWindow) {
      return false;
    }

    console.info("[focus-pet] reveal via window api");
    await petWindow.setSize(new LogicalSize(FOCUS_PET_SIZE, FOCUS_PET_SIZE));
    await petWindow.setAlwaysOnTop(true);
    await petWindow.show();
    await petWindow.unminimize();

    return true;
  } catch (error) {
    console.warn("Unable to reveal focus pet with window api.", error);
    return false;
  }
}

async function hidePetWindowWithJsApi() {
  try {
    const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
    const petWindow = await WebviewWindow.getByLabel(FOCUS_PET_LABEL);

    if (!petWindow) {
      return false;
    }

    console.info("[focus-pet] hide via window api");
    await petWindow.hide();
    return true;
  } catch (error) {
    console.warn("Unable to hide focus pet with window api.", error);
    return false;
  }
}

async function invokePetCommand(command: "show_focus_pet" | "hide_focus_pet") {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const { invoke } = await import("@tauri-apps/api/core");
    console.info(`[focus-pet] ${command}`);
    await invoke(command);
    return true;
  } catch (error) {
    console.warn(`Unable to ${command.replaceAll("_", " ")}.`, error);
    return false;
  }
}

export async function showFocusPet() {
  const invoked = await invokePetCommand("show_focus_pet");
  const revealed = await revealPetWindowWithJsApi();
  return invoked || revealed;
}

export async function hideFocusPet() {
  const invoked = await invokePetCommand("hide_focus_pet");
  const hidden = await hidePetWindowWithJsApi();
  return invoked || hidden;
}

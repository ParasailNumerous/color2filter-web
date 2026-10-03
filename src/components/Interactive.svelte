<script lang="ts">
    import { getCssFilter } from "./logic";

    let colorPicker = $state("#0abec5");
    let colorText = $state("#0abec5");
    // Skeleton for default value
    let generatedFilter = $state(
        "invert(44%) sepia(68%) saturate(1024%) hue-rotate(144deg) brightness(111%) contrast(89%)",
    );
    let errorMessage = $state<string | null>(null);
    let isLoading = $state(true);
    let copied = $state(false);
    let outputEl: HTMLInputElement | undefined = $state(undefined);
    let copyTimer: ReturnType<typeof setTimeout> | undefined =
        $state(undefined);

    $effect(() => {
        if (!("WebAssembly" in window)) {
            errorMessage = "WebAssembly not supported or enabled";
        }
        let active = true;
        const targetColor = colorText;

        if (!targetColor.trim()) {
            errorMessage = "Enter a CSS color";
            generatedFilter = "";
            return;
        }

        isLoading = true;
        errorMessage = null;

        getCssFilter(targetColor).then(({ filter, error }) => {
            if (!active) return;
            isLoading = false;
            if (error) {
                errorMessage = error;
                generatedFilter = "";
            } else {
                generatedFilter = filter;
            }
        });

        return () => {
            active = false;
        };
    });

    // These two are basically the same, maybe merge?
    function onPickerInput(e: Event) {
        const el = e.currentTarget as HTMLInputElement;
        colorPicker = el.value;
        colorText = el.value;
    }

    function onTextInput(e: Event) {
        const el = e.currentTarget as HTMLInputElement;
        colorText = el.value;
        colorPicker = el.value;
    }

    async function copyFilter() {
        if (!generatedFilter) return;
        try {
            await navigator.clipboard.writeText(generatedFilter);
        } catch {
            // there's no user feedback
            outputEl?.select();
            return;
        }
        copied = true;
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => (copied = false), 1500);
    }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
    <section class="grow">
        <div
            class="flex gap-2 transition-opacity duration-200"
            class:opacity-38={isLoading}
        >
            <form
                action="#"
                class="contents"
                onsubmit={(e) => e.preventDefault()}
            >
                <div
                    class="flex-shrink-0 relative w-12 h-12 rounded-full circle-round-interact overflow-hidden contain-strict focus-within:outline-2 focus-within:outline-current focus-within:outline-offset-2"
                >
                    <input
                        type="color"
                        id="color-picker"
                        aria-label="Pick color"
                        class="absolute inset-0 w-auto h-auto scale-200 cursor-pointer"
                        bind:value={colorPicker}
                        oninput={onPickerInput}
                    />
                </div>

                <input
                    type="text"
                    id="color-input"
                    placeholder="Color"
                    aria-label="Color input"
                    autocomplete="off"
                    spellcheck="false"
                    class="flex-1 min-w-0 min-h-12 w-auto px-5 text-lg font-mono rounded-full corner-squircle bg-current/8"
                    bind:value={colorText}
                    oninput={onTextInput}
                />
            </form>
        </div>

        <div class="flex mt-4 gap-2">
            <input
                type="text"
                class="w-full font-mono min-w-0 min-h-12 border border-current/30 px-3 rounded-xl corner-squircle"
                id="total-input"
                bind:this={outputEl}
                value={generatedFilter || (errorMessage ?? "")}
                readonly
                aria-live="polite"
                aria-atomic="true"
            />
            <button
                type="button"
                class="cursor-pointer bg-current/12 hover:bg-current/16 active:bg-current/20 flex items-center justify-center w-12 h-12 rounded-full circle-round-interact flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                class:text-green-700={copied}
                class:dark:text-green-300={copied}
                class:active={copied}
                aria-label={copied ? "Copied" : "Copy to clipboard"}
                title={copied ? "Copied" : "Copy to clipboard"}
                disabled={!generatedFilter}
                onclick={copyFilter}
                >{#if copied}<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-check preview-icon"
                        ><path d="M20 6 9 17l-5-5" /></svg
                    >{:else}<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-copy preview-icon"
                        ><rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                        /><path
                            d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                        /></svg
                    >{/if}</button
            >
        </div>
    </section>

    <section class="flex flex-col gap-y-2 w-full max-w-sm mx-auto">
        <div class="flex justify-around">
            <h3 class="font-semibold text-xl">Original</h3>
            <h3 class="font-semibold text-xl">Filter</h3>
        </div>
        <div class="flex overflow-hidden h-12 rounded-xl corner-squircle">
            <div class="relative w-full h-full overflow-hidden bg-black">
                <div
                    class="w-full h-full"
                    style={`background-color: ${colorText};`}
                ></div>
            </div>
            <div class="relative w-full h-full overflow-hidden bg-black">
                <div
                    class="w-full h-full"
                    style={`background-color: black; ${generatedFilter ? `filter: ${generatedFilter};` : ""}`}
                ></div>
            </div>
        </div>
    </section>
</div>

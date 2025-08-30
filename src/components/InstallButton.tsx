"use client"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}
const InstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault(); // Prevent default mini-banner
            setDeferredPrompt(e as BeforeInstallPromptEvent); // Save event for later
            setIsInstallable(true); // Show button
        };

        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

        return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt(); // Show install prompt user gesture
        // Optional: Log user choice
        const choiceResult = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${choiceResult.outcome}`);

        // Clear saved event and hide button
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    if (!isInstallable) return null;

    return (
        <Button onClick={handleInstallClick} style={{ position: 'fixed', bottom: 20, right: 20 }}>
            Install App
        </Button>
    );
};

export default InstallButton;

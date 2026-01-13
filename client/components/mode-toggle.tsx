"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setTheme as setReduxTheme } from "@/lib/store/features/theme/themeSlice"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { setTheme: setNextTheme, theme: nextTheme, resolvedTheme } = useTheme()
    const dispatch = useAppDispatch()
    const reduxTheme = useAppSelector((state) => state.theme.mode)
    const [mounted, setMounted] = React.useState(false)

    // Sync Redux -> Next-Themes
    React.useEffect(() => {
        if (mounted && reduxTheme !== 'system' && reduxTheme !== nextTheme) {
            setNextTheme(reduxTheme)
        }
    }, [reduxTheme, setNextTheme, nextTheme, mounted])

    // Sync Next-Themes -> Redux (Initial load / System changes)
    React.useEffect(() => {
        setMounted(true)
        if (nextTheme) {
            // We only dispatch if it's different to avoid loops, though strict equality check below helps
            // But actually, we want Redux to be the master. 
            // If we just mapped reduxTheme to the UI, that's enough.
            // But for initial load, we might want to hydrate Redux with what's in localstorage
            // However, strictly speaking, if Redux is the "source", we should initialize Redux from storage or let it be 'system'.
            // Let's just trust Redux starts at 'system' (from our slice).
        }
    }, [nextTheme])

    const toggleTheme = () => {
        const newTheme = resolvedTheme === "light" ? "dark" : "light"
        dispatch(setReduxTheme(newTheme))
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-accent/50 transition-all duration-300"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

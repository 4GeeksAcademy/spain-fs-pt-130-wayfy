import { useHotkeys } from '@tanstack/react-hotkeys'
import { HOTKEYS } from '../hotkeys/config'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useShortcut } from './useShortcut'
import useAIAssistant from './useAIAssistant'

export const useGlobalHotkeys = () => {
    const navigate = useNavigate()
    const { toggleHighContrast } = useTheme()
    const { toggleShortcut } = useShortcut()
    const { toggleListening } = useAIAssistant()

    const openDropdown = (id) => {
        const element = document.getElementById(id)

        if (!element) return;

        const dropdown = window.bootstrap.Dropdown.getOrCreateInstance(element)
        dropdown.show()
    }

    useHotkeys([
        {
            hotkey: HOTKEYS.GO_LOGIN.combo,
            callback: () => navigate('/login'),
            options: { meta: HOTKEYS.GO_LOGIN }
        },
        {
            hotkey: HOTKEYS.GO_REGISTER.combo,
            callback: () => navigate('/register'),
            options: { meta: HOTKEYS.GO_REGISTER }
        },
        {
            hotkey: HOTKEYS.GO_VOICE.combo,
            callback: () => toggleListening(),
            options: { meta: HOTKEYS.GO_VOICE }
        },
        {
            hotkey: HOTKEYS.GO_WRITER.combo,
            callback: () => window.dispatchEvent(new Event('focus-ai-input')),
            options: { meta: HOTKEYS.GO_WRITER }
        },
        {
            hotkey: HOTKEYS.GO_HOME.combo,
            callback: () => navigate('/'),
            options: { meta: HOTKEYS.GO_HOME }
        },
        {
            hotkey: HOTKEYS.GO_MAP.combo,
            callback: () => navigate('/map'),
            options: { meta: HOTKEYS.GO_MAP }
        },
        {
            hotkey: HOTKEYS.GO_HOTELS.combo,
            callback: () => navigate('/hotels'),
            options: { meta: HOTKEYS.GO_HOTELS }
        },
        {
            hotkey: HOTKEYS.GO_RESTAURANTS.combo,
            callback: () => navigate('/restaurants'),
            options: { meta: HOTKEYS.GO_RESTAURANTS }
        },
        {
            hotkey: HOTKEYS.GO_TRANSPORTS.combo,
            callback: () => navigate('/transports'),
            options: { meta: HOTKEYS.GO_TRANSPORTS }
        },
        {
            hotkey: HOTKEYS.GO_ENTERTAINMENT.combo,
            callback: () => navigate('/entertainment'),
            options: { meta: HOTKEYS.GO_ENTERTAINMENT }
        },
        {
            hotkey: HOTKEYS.GO_USER.combo,
            callback: () => openDropdown('btnLoginDropdown'),
            options: { meta: HOTKEYS.GO_USER }
        },
        {
            hotkey: HOTKEYS.GO_CONFIG.combo,
            callback: () => openDropdown('btnSettings'),
            options: { meta: HOTKEYS.GO_CONFIG }
        },
        {
            hotkey: HOTKEYS.TOGGLE_CONTRAST.combo,
            callback: () => toggleHighContrast(),
            options: { meta: HOTKEYS.TOGGLE_CONTRAST }
        },
        {
            hotkey: HOTKEYS.TOGGLE_SHORTCUTS.combo,
            callback: () => toggleShortcut(),
            options: { meta: HOTKEYS.TOGGLE_SHORTCUTS }
        }
    ])
}

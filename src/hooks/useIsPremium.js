import useAppStore from '../store/appStore'

export function useIsPremium() {
  return useAppStore((s) => s.isPremium)
}

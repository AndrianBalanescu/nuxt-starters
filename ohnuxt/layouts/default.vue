<script setup lang="ts">
import { ref, h, defineAsyncComponent } from 'vue'
import {
  LayoutDashboard,
  Layers,
  SlidersHorizontal,
  Settings,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const CommandPalette = defineAsyncComponent(() => import('~/components/CommandPalette.vue'))
const HiddenPlaceholder = () => h('div', { style: 'display:none' })
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const route = useRoute()
</script>

<template>
  <div class="shell">
    <!-- Floating Top Notch Bar -->
    <ClientOnly>
      <AppNotch />
    </ClientOnly>

    <!-- Mobile Drawer Scrim -->
    <div
      v-if="isMobileSidebarOpen"
      class="mobile-backdrop"
      @click="isMobileSidebarOpen = false"
    ></div>

    <!-- ═══════════════ SIDEBAR ═══════════════ -->
    <aside
      class="sidebar"
      :class="{
        'is-collapsed': isSidebarCollapsed,
        'is-open': isMobileSidebarOpen,
        'is-focus-hidden': themeStore.focusMode
      }"
    >
      <!-- Sidebar Header (TOP CONTROLLER) -->
      <div class="sidebar-header">
        <div v-if="!isSidebarCollapsed" class="sidebar-brand-group">
          <div 
            class="sidebar-logo" 
            data-tip="Toggle sidebar collapse"
            data-pos="bottom"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
          >
            ⚡
          </div>
          <div class="sidebar-label">
            <div style="font-weight: 700; font-size: 13px; line-height: 1.2;">Nuxt + ohno</div>
            <div class="caption" style="font-size: 10px;">starter pack · v4</div>
          </div>
        </div>

        <!-- Top Collapse Toggle -->
        <button
          class="btn btn-ghost btn-icon btn-sm top-collapse-btn"
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :data-tip="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :data-pos="isSidebarCollapsed ? 'right' : 'bottom'"
          @click="isSidebarCollapsed = !isSidebarCollapsed"
        >
          <PanelLeftOpen v-if="isSidebarCollapsed" :size="16" />
          <PanelLeftClose v-else :size="16" />
        </button>

        <!-- Mobile Drawer Close Button -->
        <button
          class="btn btn-ghost btn-icon btn-sm mobile-close-btn"
          aria-label="Close navigation drawer"
          data-tip="Close navigation drawer"
          data-pos="bottom"
          @click="isMobileSidebarOpen = false"
        >
          <X :size="14" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <div class="sidebar-section-title">Application</div>

        <NuxtLink
          to="/"
          class="nav-item"
          :class="{ 'is-active': route.path === '/' }"
          :data-tip="isSidebarCollapsed ? 'Dashboard · System Overview' : undefined"
          data-pos="right"
          @click="isMobileSidebarOpen = false"
        >
          <span class="icon-box"><LayoutDashboard :size="17" /></span>
          <span class="sidebar-label">Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/components"
          class="nav-item"
          :class="{ 'is-active': route.path === '/components' }"
          :data-tip="isSidebarCollapsed ? 'Components · Full UI Kit' : undefined"
          data-pos="right"
          @click="isMobileSidebarOpen = false"
        >
          <span class="icon-box"><Layers :size="17" /></span>
          <span class="sidebar-label">Components</span>
          <span class="badge badge-accent sidebar-badge">All</span>
        </NuxtLink>

        <NuxtLink
          to="/customizer"
          class="nav-item"
          :class="{ 'is-active': route.path === '/customizer' }"
          :data-tip="isSidebarCollapsed ? 'Customizer · Live Design Tokens' : undefined"
          data-pos="right"
          @click="isMobileSidebarOpen = false"
        >
          <span class="icon-box"><SlidersHorizontal :size="17" /></span>
          <span class="sidebar-label">Customizer</span>
        </NuxtLink>

        <div class="sidebar-section-divider"></div>
        <div class="sidebar-section-title">Preferences</div>

        <NuxtLink
          to="/settings"
          class="nav-item"
          :class="{ 'is-active': route.path === '/settings' }"
          :data-tip="isSidebarCollapsed ? 'Settings · Preferences & Theme' : undefined"
          data-pos="right"
          @click="isMobileSidebarOpen = false"
        >
          <span class="icon-box"><Settings :size="17" /></span>
          <span class="sidebar-label">Settings</span>
        </NuxtLink>
      </nav>

      <!-- Sidebar Footer (BOTTOM CONTROLLER) -->
      <div class="sidebar-footer">
        <button
          class="btn btn-ghost btn-icon btn-sm footer-action-btn"
          aria-label="Toggle Focus Mode"
          data-tip="Focus Mode · Full Screen Canvas"
          :data-pos="isSidebarCollapsed ? 'right' : 'top'"
          @click="themeStore.toggleFocusMode()"
        >
          <Maximize2 :size="15" />
        </button>
        <button
          class="btn btn-ghost btn-icon btn-sm bottom-collapse-btn footer-action-btn"
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :data-tip="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :data-pos="isSidebarCollapsed ? 'right' : 'top'"
          @click="isSidebarCollapsed = !isSidebarCollapsed"
        >
          <ChevronRight v-if="isSidebarCollapsed" :size="15" />
          <ChevronLeft v-else :size="15" />
        </button>
      </div>
    </aside>

    <!-- ═══════════════ MAIN VIEWPORT ═══════════════ -->
    <div class="viewport">
      <!-- Mobile Top Bar with Drawer Hamburger -->
      <header class="mobile-topbar">
        <button
          class="btn btn-ghost btn-icon btn-sm"
          aria-label="Open navigation drawer"
          data-tip="Open navigation drawer"
          data-pos="bottom"
          @click="isMobileSidebarOpen = true"
        >
          <Menu :size="18" />
        </button>
        <span style="font-weight: 700; font-size: 13px;">Nuxt + ohno</span>
        <div style="width: 32px;"></div>
      </header>

      <!-- Page Content -->
      <main class="content-main">
        <slot />
      </main>
    </div>

    <!-- ═══════════════ GLOBAL OVERLAYS ═══════════════ -->
    <ClientOnly>
      <CommandPalette :placeholder="HiddenPlaceholder" />
      <AppModal />
    </ClientOnly>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: var(--o-bg);
  color: var(--o-text);
  position: relative;
}

.viewport {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-main {
  flex: 1;
  padding: calc(var(--o-s4, 16px) + 8px) var(--o-s4, 16px) var(--o-s4, 16px);
  max-width: 1360px;
  width: 100%;
  margin: 0 auto;
}

.mobile-topbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--o-border);
  background: var(--o-surface-1, var(--o-bg));
}

/* ═══════════ SIDEBAR BASE ═══════════ */
.sidebar {
  width: 220px;
  border-right: 1px solid var(--o-border);
  background: var(--o-surface-1, var(--o-bg));
  display: flex;
  flex-direction: column;
  transition: width 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  z-index: 100;
  box-sizing: border-box;
}

.sidebar.is-focus-hidden {
  display: none;
}

/* ═══════════ SIDEBAR HEADER ═══════════ */
.sidebar-header {
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--o-border);
  height: 52px;
  box-sizing: border-box;
}

.sidebar-brand-group {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.sidebar-logo {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}

.top-collapse-btn {
  color: var(--o-text-3);
  transition: all 0.15s ease;
  width: 32px;
  height: 32px;
  padding: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--o-r-md, 6px);
}

.top-collapse-btn:hover {
  color: var(--o-text);
  background: var(--o-surface-2, rgba(255, 255, 255, 0.08));
}

/* ═══════════ SIDEBAR NAV & ITEMS ═══════════ */
.sidebar-nav {
  flex: 1;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.sidebar-section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--o-text-3);
  padding: 10px 8px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-section-divider {
  display: none;
  height: 1px;
  background: var(--o-border);
  margin: 6px auto;
  width: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  height: 36px;
  border-radius: var(--o-r-md, 6px);
  color: var(--o-text-2);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-sizing: border-box;
}

.nav-item:hover {
  color: var(--o-text);
  background: var(--o-surface-2, rgba(255, 255, 255, 0.08));
}

.nav-item.is-active {
  color: var(--o-accent-text);
  background: var(--o-accent-soft, rgba(113, 116, 212, 0.14));
  font-weight: 600;
}

.icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.sidebar-badge {
  margin-left: auto;
}

/* ═══════════ SIDEBAR FOOTER ═══════════ */
.sidebar-footer {
  padding: 0 10px;
  height: 48px;
  border-top: 1px solid var(--o-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.footer-action-btn {
  width: 32px;
  height: 32px;
  padding: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--o-r-md, 6px);
  color: var(--o-text-3);
  transition: all 0.15s ease;
}

.footer-action-btn:hover {
  color: var(--o-text);
  background: var(--o-surface-2, rgba(255, 255, 255, 0.08));
}

/* ═══════════ PERFECT COLLAPSED STATE ═══════════ */
.sidebar.is-collapsed {
  width: 56px;
}

.sidebar.is-collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}

.sidebar.is-collapsed .top-collapse-btn {
  width: 36px;
  height: 36px;
  margin: 0 auto;
}

.sidebar.is-collapsed .sidebar-nav {
  padding: 10px 0;
  align-items: center;
}

.sidebar.is-collapsed .sidebar-section-title,
.sidebar.is-collapsed .sidebar-label,
.sidebar.is-collapsed .sidebar-badge {
  display: none !important;
}

.sidebar.is-collapsed .sidebar-section-divider {
  display: block;
}

.sidebar.is-collapsed .nav-item {
  width: 36px;
  height: 36px;
  padding: 0;
  margin: 0 auto;
  justify-content: center;
  gap: 0;
  border-radius: var(--o-r-md, 6px);
}

.sidebar.is-collapsed .icon-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.is-collapsed .sidebar-footer {
  padding: 8px 0;
  height: auto;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.sidebar.is-collapsed .footer-action-btn {
  width: 36px;
  height: 36px;
  margin: 0 auto;
}

/* ═══════════ MOBILE DRAWER ═══════════ */
.mobile-close-btn {
  display: none;
  margin-left: auto;
}

.mobile-backdrop {
  display: none;
}

@media (max-width: 768px) {
  .mobile-topbar {
    display: flex;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 260px !important;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--o-shadow-lg);
    z-index: 1000;
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .mobile-close-btn {
    display: inline-flex;
  }

  .top-collapse-btn,
  .bottom-collapse-btn {
    display: none;
  }

  .mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 999;
  }
}
</style>

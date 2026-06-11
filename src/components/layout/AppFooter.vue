<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-logo">iVOD</div>
        <p class="copyright">© iTVT Poland Group - Wszelkie prawa zastrzeżone 2026</p>
        <a class="footer-link" href="https://vod.itvt.xyz" target="_blank">vod.itvt.xyz</a>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Nawigacja</h4>
        <router-link class="footer-link" to="/">Kanały TV</router-link>
        <router-link class="footer-link" to="/category/all">Wszystkie kategorie</router-link>
        <router-link class="footer-link" to="/#prywatnosc">Prywatność</router-link>
        <a class="footer-link" href="mailto:kontakt@itvt.xyz">Kontakt</a>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Inne</h4>
        <router-link class="footer-link" to="/apps">Aplikacje</router-link>
        <router-link class="footer-link" to="/#faq">FAQ</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--primary-dark);
  border-top: 1px solid var(--secondary-dark);
  padding: var(--space-lg);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-lg);
  max-width: 1126px;
  margin: 0 auto;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--pure-white);
  margin-bottom: var(--space-sm);
}

.copyright {
  font-size: var(--meta-size);
  color: var(--light-grey);
  margin: 0;
}

.footer-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--pure-white);
  margin: 0 0 var(--space-sm);
}

.footer-link {
  color: var(--pure-white);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--light-grey);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>

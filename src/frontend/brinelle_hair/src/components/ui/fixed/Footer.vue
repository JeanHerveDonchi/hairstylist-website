<script setup lang="ts">
import { COLORS } from '@/constants/colors';
import { SOCIAL_LINKS, POLICY_LINKS, REVIEW_LINKS, INTERNAL_ROUTES } from '@/constants/links'
</script>

<template>
  <footer class="w-full min-h-[500px] px-6 md:px-12 py-12 md:py-16"
  :style="{backgroundColor: COLORS.color_tertiary}">
    <div class="h-full max-w-[1400px] mx-auto">
      <!-- Outer Grid: 2 columns with space-between -->
      <div class="flex flex-col md:flex-row md:justify-between gap-12 mb-12">
        <!-- Left Column: LIENS RAPIDES -->
        <div>
          <h3 class="text-[16px] md:text-[18px] uppercase mb-6 md:mb-8"
          :style="{color: COLORS.color_text_sub}">
            LIENS RAPIDES
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Sub-column 1: Social Links -->
            <div class="flex flex-col gap-4">
              <a
                :href="SOCIAL_LINKS.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Instagram
              </a>
              <a
                :href="SOCIAL_LINKS.facebook"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Facebook
              </a>
              <router-link
                :to="INTERNAL_ROUTES.gallery"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Gallery
              </router-link>
            </div>

            <!-- Sub-column 2: Contact Links -->
            <div class="flex flex-col gap-4">
              <a
                :href="SOCIAL_LINKS.whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Me contacter par whatsapp
              </a>
              <a
                :href="SOCIAL_LINKS.email"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Me contacter par email
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: NOS POLITIQUES + Review CTA -->
        <div class="flex flex-col gap-12">
          <!-- NOS POLITIQUES Section -->
          <div>
            <h3 class="text-[16px] md:text-[18px] uppercase mb-6 md:mb-8"
            :style="{color: COLORS.color_text_sub}">
              NOS POLITIQUES
            </h3>
            <div class="flex flex-col gap-4">
              <a
                :href="POLICY_LINKS.privacy"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Politique de confidentialité
              </a>
              <a
                :href="POLICY_LINKS.terms"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Conditions d'utilisation
              </a>
              <a
                :href="POLICY_LINKS.refund"
                class="text-[14px] md:text-[16px] hover:opacity-80 transition-opacity"
                :style="{color: COLORS.color_text_sub}"
              >
                Politique de remboursement
              </a>
            </div>
          </div>

          <!-- Review CTA Section -->
          <div>
            <p class="text-[18px] md:text-[20px] mb-2"
            :style="{color: COLORS.color_text_sub}">
              Avez-vous essayé nos services?
            </p>
            <a
              :href="REVIEW_LINKS.leaveReview"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[18px] md:text-[20px] hover:opacity-80 transition-opacity inline-block"
              :style="{color: COLORS.color_primary}"
            >
              Laissez nous un retour
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="text-left">
        <p class="text-[12px] md:text-[14px]"
        :style="{color: COLORS.color_text_sub}">
          © 2025 BrinelleHair Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>
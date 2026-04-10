import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

const { push, fetchCategories, homePage } = vi.hoisted(() => ({
  push: vi.fn(),
  fetchCategories: vi.fn(),
  homePage: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

vi.mock('@/services/category.service', () => ({
  fetchCategories,
}))

vi.mock('@/data/cms0', () => ({
  data: {
    HomePage: homePage,
  },
}))

import HomeView from '@/views/HomeView.vue'

const TitleStub = defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  template: '<div data-test="title">{{ text }}</div>',
})

const HairCategoryCardStub = defineComponent({
  props: {
    categoryTitle: {
      type: String,
      required: true,
    },
  },
  template: '<div class="category-card">{{ categoryTitle }}</div>',
})

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    homePage.mockResolvedValue({
      heroTitle: 'Titre CMS',
    })

    fetchCategories.mockResolvedValue([
      {
        id: 'cat-1',
        coverImageUrl: '',
        title: 'Hommes',
        startPrice: 25,
        description: '',
      },
      {
        id: 'cat-2',
        coverImageUrl: '',
        title: 'Femmes',
        startPrice: 35,
        description: '',
      },
    ])
  })

  it('loads cms and supabase content on mount', async () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          HeroSection: true,
          MainButton: true,
          Title: TitleStub,
          HairCategoryCard: HairCategoryCardStub,
        },
      },
    })

    await flushPromises()

    expect(homePage).toHaveBeenCalledTimes(1)
    expect(fetchCategories).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-test="title"]').text()).toBe('Titre CMS')
    expect(wrapper.findAll('.category-card')).toHaveLength(2)
  })
})

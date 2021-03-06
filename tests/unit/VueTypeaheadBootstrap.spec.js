import { mount } from '@vue/test-utils'
import VueTypeaheadBootstrap from '@/components/VueTypeaheadBootstrap.vue'
import VueTypeaheadBootstrapList from '@/components/VueTypeaheadBootstrapList.vue'

describe('VueTypeaheadBootstrap', () => {
  let wrapper

  const demoData = [
    'Canada',
    'United States',
    'Mexico',
    'Japan',
    'China',
    'United Kingdom'
  ]

  beforeEach(() => {
    wrapper = mount(VueTypeaheadBootstrap, {
      propsData: {
        data: demoData
      }
    })
  })

  it('Should mount and render a hidden typeahead list', () => {
    let child = wrapper.find(VueTypeaheadBootstrapList)
    expect(child).toBeTruthy()
    expect(child.isVisible()).toBe(false)
  })

  it('Formats the input data properly', () => {
    expect(wrapper.vm.formattedData[0].id).toBe(0)
    expect(wrapper.vm.formattedData[0].data).toBe('Canada')
    expect(wrapper.vm.formattedData[0].text).toBe('Canada')
  })

  it('Uses a custom serializer properly', () => {
    wrapper = mount(VueTypeaheadBootstrap, {
      propsData: {
        data: [{
          name: 'Canada',
          code: 'CA'
        }],
        value: 'Can',
        serializer: t => t.name
      }
    })
    expect(wrapper.vm.formattedData[0].id).toBe(0)
    expect(wrapper.vm.formattedData[0].data.code).toBe('CA')
    expect(wrapper.vm.formattedData[0].text).toBe('Canada')
  })

  it('Allows for a name to be provided for the input', () => {
    wrapper.setProps({inputName: 'name-is-provided-for-this-input'})
    expect(wrapper.find('input').attributes().name).toBe('name-is-provided-for-this-input')
  })

  it('Show the list when given a query', () => {
    let child = wrapper.find(VueTypeaheadBootstrapList)
    expect(child.isVisible()).toBe(false)
    wrapper.find('input').setValue('Can')
    expect(child.isVisible()).toBe(true)
  })

  it('Hides the list when focus is lost', () => {
    let child = wrapper.find(VueTypeaheadBootstrapList)
    wrapper.setData({inputValue: 'Can'})
    wrapper.find('input').trigger('focus')
    expect(child.isVisible()).toBe(true)
    wrapper.find('input').trigger('focusout')
    expect(child.isVisible()).toBe(false)
  })

  it('Renders the list in different sizes', () => {
    expect(wrapper.vm.sizeClasses).toBe('input-group')
    wrapper.setProps({
      size: 'lg'
    })
    expect(wrapper.vm.sizeClasses).toBe('input-group input-group-lg')
  })

  describe ('key press handling', () =>{
    it('Emits a keyup.enter event when enter is pressed on the input field', () => {
      let input = wrapper.find('input')
      input.trigger('keyup.enter')
      expect(wrapper.emitted().keyup).toBeTruthy()
      expect(wrapper.emitted().keyup.length).toBe(1)
      expect(wrapper.emitted().keyup[0][0].keyCode).toBe(13)
    })

    it('triggers the correct event when hitting enter', () => {
      let child = wrapper.find(VueTypeaheadBootstrapList)
      const hitActive = spyOn(child.vm, "hitActiveListItem")
      let input = wrapper.find('input')

      input.trigger('keyup.enter')

      expect(hitActive).toHaveBeenCalledWith()
    })

    it('triggers the correct event when hitting the down arrow', () => {
      let child = wrapper.find(VueTypeaheadBootstrapList)
      const selectNextListItem = spyOn(child.vm, "selectNextListItem")
      let input = wrapper.find('input')

      input.trigger('keyup.down')

      expect(selectNextListItem).toHaveBeenCalledWith()
    })

    it('triggers the correct event when hitting up arrow', () => {
      let child = wrapper.find(VueTypeaheadBootstrapList)
      const selectPreviousListItem = spyOn(child.vm, "selectPreviousListItem")
      let input = wrapper.find('input')

      input.trigger('keyup.up')

      expect(selectPreviousListItem).toHaveBeenCalledWith()
    })
  })
})

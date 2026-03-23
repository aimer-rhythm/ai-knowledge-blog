export default defineEventHandler((event) => {
  return { isUnlocked: event.context.isPrivateAdmin === true }
})

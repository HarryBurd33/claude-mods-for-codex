export const activityJournal = {
  type: "activityJournal",
  allowedKeys: [],
  validate() {
    return {};
  },
  handle() {
    return { journal: true };
  },
};

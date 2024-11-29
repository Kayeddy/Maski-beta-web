// Define custom events
export const likeEvent = new CustomEvent("petLiked", {
  detail: {
    // Include any data relevant to the event
  },
});

export const slideChangeEvent = new CustomEvent("slideChanged", {
  detail: {
    // Include any data relevant to the event
  },
});

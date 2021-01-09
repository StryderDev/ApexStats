module.exports = {
  name: "privacypolicy",
  description: "Shows the privacy policy.",
  execute(message) {
    message.channel.send(
      "Privacy Policy: https://apexstats.dev/privacypolicy.html"
    );
  },
};

function make_tour() {
    const tour = new Shepherd.Tour({
      tourName: 'debug-tour',
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'c-onboarding-modal',
        scrollTo: true,
        scrollToHandler: this.scrollToHandler
      },
      disableScroll: true
    });
    tour.addStep({
      title: 'Please, bear in mind',
      text: `Sometimes, it takes some time to connect the app with our Kafka Server to get the coordinates`,
      buttons: [
        {
          action() {
            return this.next();
          },
          text: 'Close'
        }
      ],
      id: 'Welcome'
    });

    tour.start();
}
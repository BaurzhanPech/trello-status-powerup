/* global TrelloPowerUp */

// Супер-простой тест: одна кнопка на карточке

TrelloPowerUp.initialize({
  'card-buttons': function (t, opts) {
    return [
      {
        text: 'Test Squid',
        callback: function (t) {
          return t.alert({
            message: 'SquidStatus работает 🦑',
            display: 'info'
          });
        }
      }
    ];
  }
});

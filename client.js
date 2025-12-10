/* global TrelloPowerUp */

// ключи для хранения данных
var STATUS_KEY = 'cardStatus';
var COMMENTS_ENABLED_KEY = 'commentsEnabled';

// твои статусы
var STATUSES = [
  { text: '⚪ do', value: 'do', color: 'grey' },
  { text: '🟡 doing', value: 'doing', color: 'yellow' },
  { text: '🔵 waite', value: 'waite', color: 'blue' },
  { text: '🟥 blocked', value: 'blocked', color: 'red' },
  { text: '🟩 done', value: 'done', color: 'green' }
];

// Инициализация Power-Up
TrelloPowerUp.initialize({

  // 1) Кнопка на карточке
  'card-buttons': function (t, opts) {
    return [
      {
        text: 'Статус задачи',
        callback: function (t) {
          return t.popup({
            title: 'Выбери статус',
            items: function () {
              var statusItems = STATUSES.map(function (status) {
                return {
                  text: status.text,
                  callback: function (t) {
                    return onStatusSelected(t, status);
                  }
                };
              });

              statusItems.push({
                text: '⚙ Настройки комментариев',
                callback: function (t) {
                  return openSettings(t);
                }
              });

              return statusItems;
            }
          });
        }
      }
    ];
  },

  // 2) Бейдж на карточке (виден, когда карточка не открыта)
  'card-badges': function (t, opts) {
    return t.get('card', 'shared', STATUS_KEY)
      .then(function (value) {
        if (!value) return [];

        var status = STATUSES.find(function (s) {
          return s.value === value;
        });

        if (!status) return [];

        return [{
          text: status.value,
          color: status.color
        }];
      });
  }
});

// обработка выбора статуса
function onStatusSelected(t, status) {
  return Promise.all([
    t.get('card', 'shared', STATUS_KEY),
    t.get('board', 'private', COMMENTS_ENABLED_KEY, true)
  ]).then(function (values) {
    var currentStatus = values[0];
    var commentsEnabled = values[1];

    var actions = [];

    actions.push(
      t.set('card', 'shared', STATUS_KEY, status.value)
    );

    if (commentsEnabled && currentStatus !== status.value) {
      actions.push(
        t.comment('Статус задачи изменен на: ' + status.value)
      );
    }

    return Promise.all(actions);
  });
}

// popup настроек: включить / выключить комментарии
function openSettings(t) {
  return t.popup({
    title: 'Настройки',
    items: function () {
      return t.get('board', 'private', COMMENTS_ENABLED_KEY, true)
        .then(function (commentsEnabled) {
          return [
            {
              text: (commentsEnabled ? '🔕 Отключить' : '🔔 Включить') + ' комментарии при смене статуса',
              callback: function (t) {
                return t.set('board', 'private', COMMENTS_ENABLED_KEY, !commentsEnabled);
              }
            }
          ];
        });
    }
  });
}

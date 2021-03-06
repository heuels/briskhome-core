# **BRISK**HOME:** ** core.bus

### Описание
Модуль `@briskhome/core.bus` является реализацией интерфейса общей шины для обмена сообщениями между модулями системы.

### Протокол
Начиная с версии модуля 0.1.4 формат сообщений для обмена по общей шине стандартизован. Использование какого-либо другого формата, кроме приведенного здесь не рекомендуется, так как может привести к непредсказуемым последствиям.  

#### Заголовок сообщения
Заголовок сообщения должен содержать:
* `namespace` *String* - Пространство имен. В случае, если сообщение является широковещательным, т.е. модуль-отправитель не знает наименование модуля-получателя, пространство имен должно содержать строку `broadcast`. В случае, если модуль-отправитель знает наименование модуля-получателя, пространство имен должно содержать наименование модуля-получателя.  
* `title` *String* - Наименование сообщения, определяется документацией модуля-отправителя, если сообщение является широковещательным, или документацией модуля-получателя, если сообщение имеет единственного адресата.

Пространство имен и наименование сообщения разделяются двоеточием.

#### Тело сообщения
Тело сообщения *(payload)* может содержать любую информацию, которую требуется передать другому модулю, однако необходимо выдерживать строгую структуру ключей верхнего уровня. Тело сообщения должно обязательно содержать следующие ключи:  
* `module` *String* - Наименование модуля-отправителя;
* `data` *Object* - Объект данных, содержащий передаваемые данные.

*Пример сообщения:*
```js
bus.emit('broadcast:mqtt-message-received', {
  module: "@briskhome/core.mqtt",
  data: {
    topic: '/irrigation/circuits/garden',
    payload: '{"status": 0}',
  },
});
```

### История изменений
`v0.1.4`  
  - Стандартизован формат сообщений для обмена по общей шине.

`v0.1.2`  
  - Модуль добавлен в качестве системного модуля.

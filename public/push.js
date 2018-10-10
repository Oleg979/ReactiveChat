!function(p,u,s,h,m,e){p.__cmbk=p.__cmbk||function(){(p.__cmbk.q=p.__cmbk.q
    || []).push(arguments)};m=u.createElement(s);e=u.getElementsByTagName(s)[0];m.async=!0;m.src=h;
    e.parentNode.insertBefore(m,e);}(window,document,'script','//siltstrider.push.expert/js/integration.js');

    // назначить текущему токену тег(при регистрации)
    __cmbk('setRegistrationTag','test-users');
    // назначить userId текущему токену (при регистрации)
    __cmbk('setUser','yourInternalId');
    // получить текущий токен
    __cmbk('getToken', function (err, token) {
    if (!err) {console.log(token)            }
    });
    // отключить автоматический показ попапа
    __cmbk('disableAutoRender');
    // отобразить попап
    __cmbk('render');
    // изменить текст в реквесте на разрешение подписок
    __cmbk('setRequestMessage', 'Подключайте пуш-уведомления!');
    // настроить время(в секундах), через которое пользователь снова увидит запрос на показ уведомлений
    __cmbk('setCloseTimeout', 86400);
    // Доступны ли пуш-уведомления в текущем браузере
    __cmbk('availableInBrowser', function(err, isAvailable){
        if(isAvailable) {
          console.log('Push notifications are available');
        }
    });

    // подписка на события в попап-окне
    __cmbk('onEvent', eventType, cb);
    // поддерживаются события `subscription` и `popup.close`
    // - subscription
    __cmbk('onEvent', 'subscription', function(err, body){
        if(body.result) {
          console.log('Success, user hashToken', body.hashToken)
        } else {
          console.log('Error', body.error)
        }
    });
    // - popup
    __cmbk('onEvent', 'popup.close', function(err, body){
        //body = null
        console.log('popup closed');
    });


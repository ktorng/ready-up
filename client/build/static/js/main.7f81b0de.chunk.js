(this["webpackJsonpready-up"]=this["webpackJsonpready-up"]||[]).push([[0],{106:function(e){e.exports=JSON.parse('{"__schema":{"types":[]}}')},120:function(e,a,t){e.exports=t(154)},144:function(e,a,t){},145:function(e,a,t){},154:function(e,a,t){"use strict";t.r(a);var n=t(32),r=t.n(n),c=t(37),o=t(19),i=t(0),l=t.n(i),s=t(21),u=t.n(s),d=t(45),m=t(81),p=t(110),b=t(107),f=t(109),y=t(24),g=t(108),v=t(4),E=t(87),h=t(31),j=t(12),I=t(13),O=t.n(I),C=t(20),k=t(192),S=t(30),N=t(14),w=t(91),x=t.n(w),D=t(26),P=t(190),$=t(191),G=t(44),L=t(35),T=t.n(L),R=t(189),A=Object(R.a)((function(e){return{textField:{display:"block"},button:{marginTop:16,"&:not(:last-child)":{marginRight:16}},containerCenter:{display:"flex",flexDirection:"column",alignItems:"center"},flexRow:{flexDirection:"row"},linkPlain:{textDecoration:"none",color:"white"},sliderWrapper:{marginTop:16,color:"#575757"},noBorder:{border:"none"},stretch:{alignItems:"stretch"},pointer:{cursor:"pointer"},marginLeft8:{marginLeft:8},grey:{color:T.a[700]},bold:{fontWeight:"bold"},noMargin:{margin:0}}})),W=function(e){var a=e.login,t=A();return l.a.createElement(D.c,{initialValues:{name:"",email:""},validate:function(e){var a={};return e.name||(a.name="Required"),e.email?x.a.validate(e.email)||(a.email="Invalid email address"):a.email="Required",a},onSubmit:function(){var e=Object(c.a)(r.a.mark((function e(t,n){var c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=n.setSubmitting,e.next=3,a({variables:t});case 3:c(!1);case 4:case"end":return e.stop()}}),e)})));return function(a,t){return e.apply(this,arguments)}}()},(function(e){var a=e.submitForm,n=e.isSubmitting;return l.a.createElement(D.b,{className:t.containerCenter},l.a.createElement("h1",null,"Ready Up "),l.a.createElement(D.a,{component:G.a,className:t.textField,name:"name",type:"text",label:"Display Name"}),l.a.createElement(D.a,{component:G.a,className:t.textField,name:"email",type:"email",label:"Email"}),n&&l.a.createElement(P.a,null),l.a.createElement($.a,{className:t.button,variant:"contained",color:"primary",disabled:n,onClick:a},"Login"))}))},M=function(){return l.a.createElement("div",null,"Loading...")},F="ORDERED",z="FIRST",H="LAST",B=Object(i.createContext)(null),q=Object(i.createContext)(null),U=function(){return Object(i.useContext)(B)},Q=function(){return Object(i.useContext)(q)};function J(){var e=Object(j.a)(["\n    fragment GameData on Game {\n        id\n        accessCode\n        status\n        name\n        description\n        size\n        gameState {\n            ...GameStateData\n        }\n        players {\n            ...PlayerData\n        }\n        type\n    }\n    ","\n    ","\n"]);return J=function(){return e},e}function V(){var e=Object(j.a)(["\n    fragment UserData on User {\n        id\n        email\n        name\n        players {\n            ...PlayerData\n        }\n    }\n    ","\n"]);return V=function(){return e},e}function _(){var e=Object(j.a)(["\n    fragment GameStateData on GameState {\n        tasks {\n            card {\n                color\n                number\n            }\n            playerId\n            type\n            order\n            isCompleted\n        }\n        playerStates {\n            hand {\n                color\n                number\n            }\n            isCommander\n            playerId\n            played {\n                color\n                number\n                isLead\n            }\n        }\n        rounds {\n            cards {\n                color\n                number\n                playerId\n                isLead\n            }\n            winnerId\n        }\n        turn\n        turnPlayerId\n        isLost\n    }\n"]);return _=function(){return e},e}function Y(){var e=Object(j.a)(["\n    fragment PlayerData on Player {\n        id\n        userId\n        gameId\n        status\n        statusMessage\n        isHost\n        email\n        name\n    }\n"]);return Y=function(){return e},e}var K=O()(Y()),X=O()(_()),Z=O()(V(),K),ee=O()(J(),K,X);function ae(){var e=Object(j.a)(["\n    mutation login($name: String!, $email: String!) {\n        login(name: $name, email: $email) {\n            token\n            user {\n                ...UserData\n            }\n        }\n    }\n    ","\n"]);return ae=function(){return e},e}var te=O()(ae(),Z),ne=function(){var e=Object(C.a)(),a=Object(C.b)(te,{onCompleted:function(a){var t=a.login;localStorage.setItem("readyup-token",t.token),e.writeData({data:{isLoggedIn:!0,me:t.user}})}}),t=Object(N.a)(a,2),n=t[0],r=t[1],c=r.loading,o=r.error;return c?l.a.createElement(M,null):o?l.a.createElement("p",null,"An error occurred."):l.a.createElement(W,{login:n})},re=function(){var e=A();return l.a.createElement("div",{className:e.containerCenter},l.a.createElement("h1",null,"Games"),l.a.createElement("div",null,l.a.createElement($.a,{className:e.button,variant:"contained",color:"primary"},l.a.createElement(S.a,{className:e.linkPlain,to:"/create"},"Create")),l.a.createElement($.a,{className:e.button,variant:"contained",color:"primary"},l.a.createElement(S.a,{className:e.linkPlain,to:"/join"},"Join"))))},ce=t(188),oe=t(3),ie=t(194),le=function(e){return l.a.createElement(ie.a,Object.assign({},function(e){var a=e.field,t=e.form.isSubmitting,n=e.disabled,r=void 0!==n&&n,c=Object(oe.a)(e,["field","form","disabled"]);return Object(o.a)({disabled:t||r},c,{},a,{name:a.name,value:a.value})}(e),{onChange:function(a,t){return e.form.setFieldValue(e.field.name,t)},onBlur:function(a,t){return e.form.handleBlur(e.field.name,t)}}))};le.displayName="FormikMaterialUISlider";var se=le,ue=function(e){var a=e.createGame,t=e.loading,n=A();return l.a.createElement(D.c,{initialValues:{name:"",description:"",size:4},validate:function(e){var a={};return e.name||(a.name="Required"),e.size||(a.size="Required"),e.description||(a.description="Required"),a},onSubmit:function(){var e=Object(c.a)(r.a.mark((function e(t,n){var c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=n.setSubmitting,e.next=3,a({variables:t});case 3:c(!1);case 4:case"end":return e.stop()}}),e)})));return function(a,t){return e.apply(this,arguments)}}()},(function(e){var a=e.submitForm,r=e.isSubmitting;return l.a.createElement(D.b,{className:n.containerCenter},l.a.createElement("h1",null,"Create Game"),l.a.createElement("fieldset",{className:n.noBorder,disabled:t},l.a.createElement(D.a,{component:G.a,className:n.textField,name:"name",type:"text",label:"Game name"}),l.a.createElement(D.a,{component:G.a,className:n.textField,name:"description",placeholder:"Where? When?",type:"text",label:"Description"}),l.a.createElement(D.a,{name:"size",placeholder:"Number of players"},(function(e){var a=e.field,t=e.form;return l.a.createElement("div",{className:n.sliderWrapper},l.a.createElement(ce.a,{id:"size-slider",gutterBottom:!0},"Number of players: ",a.value),l.a.createElement(se,{field:a,form:t,defaultValue:4,getAriaValueText:function(e){return"".concat(e," players")},"aria-labelledby":"size-slider",valueLabelDisplay:"auto",step:1,marks:!0,min:2,max:10}))})),r&&l.a.createElement(P.a,null)),l.a.createElement($.a,{className:n.button,variant:"contained",color:"primary",disabled:r,onClick:a},"Create"))}))};function de(){var e=Object(j.a)(["\n    mutation createGame($name: String!, $description: String!, $size: Int!) {\n        createGame(name: $name, description: $description, size: $size) {\n            success\n            message\n            game {\n                accessCode\n            }\n        }\n    }\n"]);return de=function(){return e},e}var me=O()(de()),pe=function(){var e=Object(S.d)(),a=Object(C.b)(me,{onCompleted:function(a){var t=a.createGame,n=t.success,r=t.game;n&&e("/game/".concat(r.accessCode))}}),t=Object(N.a)(a,2),n=t[0],r=t[1],c=r.loading,o=r.error;return l.a.createElement(l.a.Fragment,null,o&&l.a.createElement("div",null,o),l.a.createElement(ue,{createGame:n,loading:c}))},be=function(e){var a=e.joinGame,t=e.loading,n=A();return l.a.createElement(D.c,{initialValues:{accessCode:""},validate:function(e){var a={};return e.accessCode?/^[a-z]{4}$/.test(e.accessCode)||(a.accessCode="Access code must be a 4 character code"):a.accessCode="Required",a},onSubmit:function(){var e=Object(c.a)(r.a.mark((function e(t,n){var c;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=n.setSubmitting,e.next=3,a({variables:t});case 3:c(!1);case 4:case"end":return e.stop()}}),e)})));return function(a,t){return e.apply(this,arguments)}}()},(function(e){var a=e.submitForm,r=e.isSubmitting;return l.a.createElement(D.b,{className:n.containerCenter},l.a.createElement("h1",null,"Join Game"),l.a.createElement("fieldset",{className:n.noBorder,disabled:t},l.a.createElement(D.a,{component:G.a,className:n.textField,name:"accessCode",type:"text",label:"Access code"}),r&&l.a.createElement(P.a,null)),l.a.createElement($.a,{className:n.button,variant:"contained",color:"primary",disabled:r,onClick:a},"Join"))}))};function fe(){var e=Object(j.a)(["\n    mutation joinGame($accessCode: String!) {\n        joinGame(accessCode: $accessCode) {\n            success\n            message\n            game {\n                accessCode\n            }\n        }\n    }\n"]);return fe=function(){return e},e}var ye=O()(fe()),ge=function(){var e=Object(S.d)(),a=Object(S.e)().accessCode,t=Object(i.useState)(""),n=Object(N.a)(t,2),r=n[0],c=n[1],o=Object(C.b)(ye,{onCompleted:function(a){var t=a.joinGame,n=t.success,r=t.message,o=t.game;n?e("/game/".concat(o.accessCode)):c(r)}}),s=Object(N.a)(o,2),u=s[0],d=s[1].loading;return Object(i.useEffect)((function(){a&&u({variables:{accessCode:a}})}),[a,u]),l.a.createElement(l.a.Fragment,null,r&&l.a.createElement("div",null,r),l.a.createElement(be,{joinGame:u,loading:d}))},ve=t(38),Ee=t(17),he=t.n(Ee),je=t(98),Ie=t.n(je),Oe=t(99),Ce=t.n(Oe),ke=function(e){var a=e.showAccessCode,t=e.me,n=U(),r=n.gameState,c=A(),o=Object(S.c)();return l.a.createElement(l.a.Fragment,null,l.a.createElement("h1",null,"Game: ",n.name),a&&l.a.createElement("h3",{className:he()(c.containerCenter,c.flexRow)},"Access code: ",n.accessCode,l.a.createElement("div",{className:he()(c.pointer,c.marginLeft8),onClick:function(){return Ie()(o.href.replace("game","join"))},title:"Copy join game link"},l.a.createElement(Ce.a,null))),l.a.createElement("h3",{className:he()(c.containerCenter,c.grey)},function(e,a,t){if("WAITING"===e.status)return"Waiting for players...";var n=a.turnPlayerId,r=a.turn,c=e.players.find((function(e){return e.id===n}))||{name:"fix this later"};return l.a.createElement(l.a.Fragment,null,l.a.createElement("p",{style:{marginTop:0}},r?"Turn: ".concat(a.turn):"Assigning Tasks..."),l.a.createElement("p",{style:{marginTop:0}},t.id===c.userId?"Waiting on you!":"Waiting on player: ".concat(c.name)))}(n,r,t)))},Se=t(11),Ne=t(102),we=t.n(Ne),xe=t(103),De=t.n(xe),Pe=t(101),$e=t.n(Pe),Ge=t(100),Le=t.n(Ge),Te=function(e){var a=e.game,t=e.isCurrent,n=e.player,r=e.updatePlayer,c="READY"===n.status;return l.a.createElement("div",t&&{onClick:function(){var e=c?"WAITING":"READY";r({variables:{gameId:a.id,playerId:n.id,status:e},optimisticResponse:{__typename:"Mutation",updatePlayer:{__typename:"PlayerUpdateResponse",success:!0,player:Object(o.a)({},n,{status:e})}}})}},c?l.a.createElement(Le.a,null):l.a.createElement($e.a,null))},Re=Object(R.a)((function(e){return{player:{width:"100%",display:"flex",background:"#ececec",padding:8,marginBottom:8,fontSize:14,alignItems:"center"},header:{fontSize:10,fontWeight:600,lineHeight:.5},empty:{justifyContent:"center",fontSize:12},name:{flex:"0 0 25%",display:"flex",alignItems:"center"},ready:{flex:"0 0 15%",display:"flex",alignItems:"center"},note:{flex:"0 0 50%"},disconnected:{color:T.a[500]}}}));function Ae(){var e=Object(j.a)(["\n    mutation updatePlayer($playerId: ID!, $gameId: ID!, $status: PlayerStatus, $statusMessage: String) {\n        updatePlayer(playerId: $playerId, gameId: $gameId, status: $status, statusMessage: $statusMessage) {\n            success,\n            player {\n                ...PlayerData\n            }\n        }\n    }\n    ","\n"]);return Ae=function(){return e},e}var We=O()(Ae(),K),Me=function(e){var a=e.game,t=e.player,n=e.isCurrent,r=Re(),c=Object(C.b)(We),o=Object(N.a)(c,1)[0];return l.a.createElement("div",{className:he()(r.player,Object(Se.a)({},r.disconnected,!n&&"DISCONNECTED"===t.status))},l.a.createElement("div",{className:r.name},l.a.createElement("span",{title:t.email},t.name),t.isHost&&l.a.createElement("span",{title:"Host",style:{marginLeft:4}},l.a.createElement(we.a,{title:"Host",fontSize:"small",style:{color:De.a[700]}}))),l.a.createElement("div",{className:r.ready},l.a.createElement(Te,{isCurrent:n,game:a,player:t,updatePlayer:o})),l.a.createElement("div",{className:r.note},t.statusMessage))},Fe=function(e){var a=e.isStartDisabled,t=e.isHost,n=e.startGame,r=e.leaveGame,c=A();return l.a.createElement("div",null,t&&l.a.createElement($.a,{className:c.button,variant:"contained",color:"primary",disabled:a,onClick:n},"Start"),l.a.createElement($.a,{className:c.button,variant:"contained",color:"secondary",onClick:r},"Leave"))};function ze(){var e=Object(j.a)(["\n    mutation leaveGame($gameId: ID!) {\n        leaveGame(gameId: $gameId) {\n            success\n        }\n    }\n"]);return ze=function(){return e},e}var He=O()(ze()),Be=function(e){var a=e.subscribe,t=e.startCrewGame,n=A(),r=Re(),c=U(),o=Q(),s=Object(S.d)(),u=Object(C.b)(He,{variables:{gameId:c.id},onCompleted:function(e){e.leaveGame.success&&s("/")}}),d=Object(N.a)(u,1)[0],m=c.players.find((function(e){return e.userId===o.id})),p=c.players.some((function(e){return"READY"!==e.status}));return Object(i.useEffect)((function(){m&&a(m.id)}),[]),l.a.createElement("div",{className:n.containerCenter},l.a.createElement(ke,{showAccessCode:!0}),l.a.createElement("div",{className:he()(r.player,r.header)},l.a.createElement("div",{className:r.name},"Name"),l.a.createElement("div",{className:r.ready},"Ready"),l.a.createElement("div",{className:r.note},"Note")),c.players.map((function(e){return l.a.createElement(Me,{key:"player-".concat(e.id),game:c,player:e,isCurrent:o.id===e.userId})})),Array(c.size-c.players.length).fill(0).map((function(e,a){return l.a.createElement("div",{key:"open-slot-".concat(a+1),className:he()(r.player,r.empty)},"(open)")})),l.a.createElement(Fe,{isStartDisabled:p,isHost:m.isHost,startGame:t,leaveGame:d}))},qe=t(54),Ue=t.n(qe),Qe=t(62),Je=t.n(Qe),Ve=t(104),_e=t.n(Ve),Ye=t(105),Ke=t.n(Ye),Xe=Object(R.a)((function(e){return{card:{width:20,height:30,border:"1px solid #ececec",display:"flex",backgroundColor:T.a[500]},current:{width:30,height:45},R:{backgroundColor:Ue.a[700],color:T.a[50]},G:{backgroundColor:Je.a[700],color:T.a[50]},B:{backgroundColor:_e.a[700],color:T.a[50]},Y:{backgroundColor:Ke.a[400]},W:{backgroundColor:T.a[200]},isCompleted:{backgroundColor:T.a[700],color:T.a[50]},isPlayable:{border:"1px solid ".concat(Je.a[300])},isLead:{border:"1px solid ".concat(Ue.a[300]),boxShadow:"0 0 10px 2px ".concat(Ue.a[300])},hover:{border:"1px solid black",cursor:"pointer"},taskSymbol:{alignSelf:"flex-end"},task:{width:30,height:45}}}));var Ze=function(e){var a,t=e.card,n=e.taskProps,r=void 0===n?{}:n,c=e.handleClick,o=e.isCurrent,s=e.hideHover,u=void 0!==s&&s,d=e.shouldShow,m=void 0!==d&&d,p=!Object(ve.isEmpty)(r),b=Object(i.useState)(!1),f=Object(N.a)(b,2),y=f[0],g=f[1],v=Xe(),E=function(e){var a=e.type,t=e.order,n=e.isCompleted,r={symbol:""};switch(a){case z:r.tooltip="This task must be completed first.",r.symbol="\u03b1";break;case H:r.tooltip="This task must be completed last.",r.symbol="\u03a9";break;case F:r.tooltip="This task must be done in order.",r.symbol=">".repeat(t+1);break;default:r.tooltip="This task can be completed at any time."}n&&(r.tooltip="This task has been completed",r.symbol="\u2713");return r}(r),h=E.tooltip,j=E.symbol,I=o||p||m;return l.a.createElement("div",Object.assign({className:he()(v.card,(a={},Object(Se.a)(a,v.hover,I&&y&&!u),Object(Se.a)(a,v.task,p),Object(Se.a)(a,v.current,o),Object(Se.a)(a,v[t.color],I),Object(Se.a)(a,v.isCompleted,p&&r.isCompleted),Object(Se.a)(a,v.isPlayable,!p&&!!c),Object(Se.a)(a,v.isLead,t.isLead),a)),onMouseEnter:function(){return g(!0)},onMouseLeave:function(){return g(!1)},title:p?h:""},c?{onClick:function(){return c(t,r)}}:{}),I&&l.a.createElement(l.a.Fragment,null,l.a.createElement("div",null,t.number),p&&l.a.createElement("div",{className:v.taskSymbol},j)))},ea=Object(R.a)((function(e){return{cardContainer:{display:"flex",flexWrap:"wrap",justifyContent:"center"},playerContainer:{display:"flex",flexDirection:"column",flexWrap:"wrap",alignItems:"center"}}})),aa=function(e){var a=e.tasks,t=e.title,n=e.handleClickCard,r=A(),c=ea(),o=U(),i=Q(),s=o.gameState.turnPlayerId===i.playerId;return l.a.createElement("div",{className:c.playerContainer},l.a.createElement("h5",{className:he()(r.bold,r.noMargin)},t),l.a.createElement("div",{className:c.cardContainer},a.map((function(e,a){return l.a.createElement(Ze,Object.assign({key:"".concat(e,"-").concat(a,"-").concat(e.playerId),card:e.card,taskProps:{type:e.type,order:e.order,isCompleted:e.isCompleted}},s?{handleClick:n}:{hideHover:!0}))}))))},ta=t(193),na=Object(R.a)((function(e){return{paper:{position:"absolute",width:400,backgroundColor:e.palette.background.paper,border:"2px solid #000",boxShadow:e.shadows[5],padding:e.spacing(2,4,3),top:"50%",left:"50%",transform:"translate(-50%, -50%)"}}})),ra=function(e){var a=e.children,t=e.open,n=e.onConfirm,r=e.onClose,c=A(),o=na();return l.a.createElement(ta.a,{open:t,onClose:r},l.a.createElement("div",{className:o.paper},a,l.a.createElement("div",null,l.a.createElement($.a,{className:c.button,variant:"outlined",color:"primary",onClick:n},"Yes"),l.a.createElement($.a,{className:c.button,variant:"outlined",color:"secondary",onClick:r},"Nevermind"))))};function ca(){var e=Object(j.a)(["\n    mutation playCard($gameId: ID!, $card: CardInput!) {\n        playCard(gameId: $gameId, card: $card) {\n            success\n            game {\n                id\n                gameState {\n                    ...GameStateData\n                }\n            }\n        }\n    }\n    ","\n"]);return ca=function(){return e},e}function oa(){var e=Object(j.a)(["\n    mutation assignTask($gameId: ID!, $card: CardInput!, $isLast: Boolean!) {\n        assignTask(gameId: $gameId, card: $card, isLast: $isLast) {\n            success\n            game {\n                id\n                gameState {\n                    ...GameStateData\n                }\n            }\n        }\n    }\n    ","\n"]);return oa=function(){return e},e}var ia=O()(oa(),X),la=O()(ca(),X),sa=function(e){var a=e.tasks,t=ea(),n=U(),r=Q(),c=Object(i.useState)(!1),o=Object(N.a)(c,2),s=o[0],u=o[1],d=Object(i.useState)(null),m=Object(N.a)(d,2),p=m[0],b=m[1],f=Object(C.b)(ia),y=Object(N.a)(f,1)[0],g=n.gameState,v=g.playerStates,E=g.rounds,h=g.turn,j=g.isLost;return-1===h?l.a.createElement("div",{className:t.boardContainer},j?"You lose!":"You win!"):l.a.createElement("div",{className:t.boardContainer},h?l.a.createElement("div",null,l.a.createElement("h4",null,"Game in progress"),l.a.createElement("h5",null,"Rounds"),E.filter((function(e){return e.cards.length===n.players.length})).map((function(e,a){return l.a.createElement("div",{key:"round-".concat(a),className:t.cardContainer},e.cards.map((function(e,t){return l.a.createElement(Ze,{key:"round-".concat(a,"-card-").concat(t),card:e,hideHover:!0,shouldShow:!0})})))})),l.a.createElement("h5",null,"Current round"),l.a.createElement("div",{className:t.cardContainer},v.filter((function(e){return!!e.played})).map((function(e,a){return l.a.createElement(Ze,{key:"cr-card-".concat(a),card:e.played,hideHover:!0,shouldShow:!0})})))):l.a.createElement(aa,{tasks:a,title:"Assign Tasks",handleClickCard:function(e,a){u(!0),b({card:e,taskProps:a})}}),s&&l.a.createElement(ra,{open:s,onConfirm:function(){var e=p.card,t=e.color,c=e.number;y({variables:{gameId:n.id,card:{color:t,number:c,playerId:r.playerId},isLast:1===a.length}}),u(!1)},onClose:function(){return u(!1)}},l.a.createElement("h4",null,"Are you sure you want to take this task?"),l.a.createElement(Ze,{card:p.card,taskProps:p.taskProps,hideHover:!0})))},ua=t(8),da=t.n(ua),ma=(da.a.shape({color:da.a.string.isRequired,number:da.a.number.isRequired,isLead:da.a.bool,playerId:da.a.string}),function(e){var a=e.card,t=A(),n=ea();return l.a.createElement("div",null,l.a.createElement("h5",{className:he()(t.bold,t.noMargin)},"Played card"),l.a.createElement("div",{className:n.cardContainer},l.a.createElement(Ze,{card:a,shouldShow:!0,hideHover:!0})))}),pa=function(e){return"W"===e.color},ba=function(e,a){return e.color===a.color};function fa(e){var a={},t=!0,n=!1,r=void 0;try{for(var c,o=e[Symbol.iterator]();!(t=(c=o.next()).done);t=!0){var i=c.value;a[i.color]||(a[i.color]=[]),a[i.color].push(i)}}catch(l){n=!0,r=l}finally{try{t||null==o.return||o.return()}finally{if(n)throw r}}return Object.keys(a).forEach((function(e){a[e].sort((function(e,a){return e.number-a.number}))})),["R","G","B","Y","W"].reduce((function(e,t){return a[t]&&(e=e.concat(a[t])),e}),[])}var ya=function(e){var a=e.player,t=e.tasks,n=U(),r=Q(),c=A(),s=ea(),u=function(e){var a=Q(),t=U().gameState,n=t.turnPlayerId,r=t.rounds;if(!(n===a.playerId))return fa(e);var c,i=r[r.length-1].cards.find((function(e){return e.isLead}));e.every(pa)?c=e.map((function(e){return Object(o.a)({},e,{isPlayable:!0})})):c=i?e.some((function(e){return ba(e,i)}))?e.map((function(e){return ba(e,i)?Object(o.a)({},e,{isPlayable:!0}):e})):e.map((function(e){return Object(o.a)({},e,{isPlayable:!0})})):e.map((function(e){return pa(e)?e:Object(o.a)({},e,{isPlayable:!0})}));return fa(c)}(a.hand),d=Object(i.useState)(!1),m=Object(N.a)(d,2),p=m[0],b=m[1],f=Object(i.useState)(null),y=Object(N.a)(f,2),g=y[0],v=y[1],E=Object(C.b)(la),h=Object(N.a)(E,1)[0],j=function(e){b(!0),v(e)};return l.a.createElement("div",{className:s.playerContainer},l.a.createElement("h4",{className:he()(c.bold,c.noMargin)},a.name),l.a.createElement("div",{className:s.cardContainer},u.map((function(e,a){return l.a.createElement(Ze,Object.assign({key:"player-".concat(r.playerId,"-card-").concat(a),card:e,isCurrent:!0},e.isPlayable?{handleClick:j}:{hideHover:!0}))}))),!!t.length&&l.a.createElement(aa,{tasks:t,title:"Tasks to complete"}),a.played&&l.a.createElement(ma,{card:a.played}),p&&l.a.createElement(ra,{open:p,onConfirm:function(){var e=g.color,a=g.number;h({variables:{gameId:n.id,card:{color:e,number:a,playerId:r.playerId},isLast:1===t.length}}),b(!1)},onClose:function(){return b(!1)}},l.a.createElement("h4",null,"Are you sure you want to play this card?"),l.a.createElement(Ze,{card:g,hideHover:!0,isCurrent:!0})))},ga=function(e){var a=A(),t=ea(),n=U(),r=Q(),c=e.player,o=e.tasks,i=c.id,s=c.played;return e.isCurrent?l.a.createElement(ya,e):l.a.createElement("div",{className:t.playerContainer},l.a.createElement("h4",Object.assign({className:he()(a.bold,a.noMargin)},"DEBUG"===n.type?{onClick:function(){return r.setPlayerId(i)}}:{}),c.name),l.a.createElement("div",{className:t.cardContainer},c.hand.map((function(e,a){return l.a.createElement(Ze,{key:"player-".concat(i,"-card-").concat(a),card:e,isCurrent:!1})}))),!!o.length&&l.a.createElement(aa,{tasks:o,title:"Tasks to complete"}),s&&l.a.createElement(ma,{card:s}))},va=t(23),Ea=Object(R.a)((function(e){return{mid:{height:400,display:"flex",flexDirection:"row"},game:{height:600},board:{flex:1,display:"flex",flexWrap:"wrap",flexDirection:"column",justifyContent:"center",alignItems:"center"},player:{height:120},playerTop:{height:90},playerVertical:{width:60,borderLeft:"1px solid gray",borderRight:"1px solid gray"},border:{border:"1px solid gray"},commander:{border:"2px solid",borderColor:Ue.a[500]},currentTurnPlayer:{backgroundColor:Je.a[100]}}})),ha=function(e,a){return e.filter((function(e){return e.playerId===a}))},ja=function(e){var a,t,n,r,c=e.subscribe,o=A(),s=Ea(),u=U(),d=Q(),m=u.gameState,p=m.tasks,b=m.turnPlayerId,f=function(e,a){return Object(i.useMemo)((function(){var t=e.players,n=e.gameState.playerStates,r=t.findIndex((function(e){return e.id===a.playerId}));return Object(ve.merge)([],[].concat(Object(va.a)(t.slice(r)),Object(va.a)(t.slice(0,r))),[].concat(Object(va.a)(n.slice(r)),Object(va.a)(n.slice(0,r))))}),[e,a.playerId])}(u,d);return Object(i.useEffect)((function(){d&&c(d.playerId)}),[]),l.a.createElement("div",{className:he()(o.containerCenter,o.stretch)},l.a.createElement("div",{className:o.containerCenter},l.a.createElement(ke,{me:d})),l.a.createElement("div",{className:s.game},l.a.createElement("div",{className:he()(s.playerTop,s.border,(a={},Object(Se.a)(a,s.commander,f[2].isCommander),Object(Se.a)(a,s.currentTurnPlayer,f[2].id===b),a))},f[2]&&l.a.createElement(ga,{player:f[2],tasks:ha(p,f[2].id)})),l.a.createElement("div",{className:s.mid},l.a.createElement("div",{className:he()(s.playerVertical,(t={},Object(Se.a)(t,s.commander,f[1].isCommander),Object(Se.a)(t,s.currentTurnPlayer,f[1].id===b),t))},f[1]&&l.a.createElement(ga,{player:f[1],tasks:ha(p,f[1].id)})),l.a.createElement("div",{className:s.board},l.a.createElement(sa,{tasks:ha(p,null)})),l.a.createElement("div",{className:he()(s.playerVertical,(n={},Object(Se.a)(n,s.commander,f[3].isCommander),Object(Se.a)(n,s.currentTurnPlayer,f[3].id===b),n))},f[3]&&l.a.createElement(ga,{player:f[3],tasks:ha(p,f[3].id)}))),l.a.createElement("div",{className:he()(s.player,s.border,(r={},Object(Se.a)(r,s.commander,f[0].isCommander),Object(Se.a)(r,s.currentTurnPlayer,f[0].id===b),r))},l.a.createElement(ga,{player:f[0],tasks:ha(p,f[0].id),isCurrent:!0}))))};function Ia(){var e=Object(j.a)(["\n    subscription cardPlayed($gameId: ID!) {\n        cardPlayed(gameId: $gameId) {\n            gameState {\n                ...GameStateData\n            }\n        }\n    }\n    ","\n"]);return Ia=function(){return e},e}function Oa(){var e=Object(j.a)(["\n    subscription taskAssigned($gameId: ID!) {\n        taskAssigned(gameId: $gameId) {\n            gameState {\n                ...GameStateData\n            }\n        }\n    }\n    ","\n"]);return Oa=function(){return e},e}function Ca(){var e=Object(j.a)(["\n    subscription crewGameStarted($gameId: ID!) {\n        crewGameStarted(gameId: $gameId) {\n            game {\n                ...GameData\n            }\n        }\n    }\n    ","\n"]);return Ca=function(){return e},e}function ka(){var e=Object(j.a)(["\n    subscription playerConnection($gameId: ID!) {\n        playerConnection(gameId: $gameId) {\n            userId\n            isConnected\n        }\n    }\n"]);return ka=function(){return e},e}function Sa(){var e=Object(j.a)(["\n    subscription playerUpdated($gameId: ID!, $currentPlayerId: ID!) {\n        playerUpdated(gameId: $gameId, currentPlayerId: $currentPlayerId) {\n            player {\n                ...PlayerData\n            }\n        }\n    }\n    ","\n"]);return Sa=function(){return e},e}function Na(){var e=Object(j.a)(["\n    subscription playerLeft($gameId: ID!, $currentPlayerId: ID!) {\n        playerLeft(gameId: $gameId, currentPlayerId: $currentPlayerId) {\n            playerId\n            hostId\n        }\n    }\n"]);return Na=function(){return e},e}function wa(){var e=Object(j.a)(["\n    subscription playerJoined($gameId: ID!) {\n        playerJoined(gameId: $gameId) {\n            player {\n                ...PlayerData\n            }\n            isNew\n        }\n    }\n    ","\n"]);return wa=function(){return e},e}var xa=O()(wa(),K),Da=O()(Na()),Pa=O()(Sa(),K),$a=O()(ka()),Ga=O()(Ca(),ee),La=O()(Oa(),X),Ta=O()(Ia(),X);function Ra(){var e=Object(j.a)(["\n    mutation startCrewGame($gameId: ID!) {\n        startCrewGame(gameId: $gameId) {\n            success\n            game {\n                ...GameData\n            }\n        }\n    }\n    ","\n"]);return Ra=function(){return e},e}function Aa(){var e=Object(j.a)(["\n    query getGame($accessCode: String!) {\n        game(accessCode: $accessCode) {\n            ...GameData\n        }\n    }\n    ","\n"]);return Aa=function(){return e},e}function Wa(){var e=Object(j.a)(["\n    query me {\n        me {\n            ...UserData\n        }\n    }\n    ","\n"]);return Wa=function(){return e},e}var Ma=O()(Wa(),Z),Fa=O()(Aa(),ee),za=O()(Ra(),ee),Ha=function(){var e=Object(i.useState)(null),a=Object(N.a)(e,2),t=a[0],n=a[1],r=Object(S.e)().accessCode,c=Object(C.c)(Fa,{variables:{accessCode:r},fetchPolicy:"network-only"}),s=c.data,u=c.loading,d=c.error,m=c.subscribeToMore,p=Object(C.c)(Ma,{fetchPolicy:"network-only"}).data,b=Object(C.b)(za,{variables:{gameId:Object(ve.get)(s,"game.id")}}),f=Object(N.a)(b,1)[0];if(u)return l.a.createElement(M,null);if(d)return l.a.createElement("p",null,"ERROR");if(!s)return l.a.createElement("p",null,"Not found");var y=s.game,g=function(e){var a;m((a=y.id,{document:xa,variables:{gameId:a},updateQuery:function(e,a){var t=a.subscriptionData;return t.data&&t.data.playerJoined.isNew?Object(ve.mergeWith)({},e,{game:{players:[t.data.playerJoined.player]}},(function(e,a){return Array.isArray(e)?[].concat(Object(va.a)(e),Object(va.a)(a)):void 0})):e}})),m(function(e,a){return{document:Da,variables:{gameId:e,currentPlayerId:a},updateQuery:function(e,a){var t=a.subscriptionData;if(!t.data)return e;var n=t.data.playerLeft,r=n.playerId,c=n.hostId,i=e.game.players.reduce((function(e,a){return c===a.id&&(a.isHost=!0),a.id!==r&&e.push(a),e}),[]);return{game:Object(o.a)({},e.game,{players:i})}}}}(y.id,e)),m(function(e,a){return{document:Pa,variables:{gameId:e,currentPlayerId:a},updateQuery:function(e,a){var t=a.subscriptionData;if(!t.data)return e;var n=t.data.playerUpdated.player;return{game:Object(o.a)({},e.game,{players:e.game.players.map((function(e){return e.id===n.id?n:e}))})}}}}(y.id,e)),m(function(e){return{document:$a,variables:{gameId:e},updateQuery:function(e,a){var t=a.subscriptionData;if(!t.data)return e;console.log(t);var n=t.data.playerConnection,r=n.userId,c=n.isConnected;return{game:Object(o.a)({},e.game,{players:e.game.players.map((function(e){return e.userId===r?Object(o.a)({},e,{status:c?"WAITING":"DISCONNECTED",statusMessage:c?"":"This player is currently disconnected."}):e}))})}}}}(y.id)),m(function(e){return{document:Ga,variables:{gameId:e},updateQuery:function(e,a){var t=a.subscriptionData;return t.data?Object(o.a)({},e,{game:t.data.crewGameStarted.game}):e}}}(y.id)),m(function(e){return{document:La,variables:{gameId:e},updateQuery:function(e,a){var t=a.subscriptionData;return t.data?Object(o.a)({},e,{game:Object(o.a)({},e.game,{gameState:t.data.taskAssigned.gameState})}):e}}}(y.id)),m(function(e){return{document:Ta,variables:{gameId:e},updateQuery:function(e,a){var t=a.subscriptionData;return t.data?Object(o.a)({},e,{game:Object(o.a)({},e.game,{gameState:t.data.cardPlayed.gameState})}):e}}}(y.id))},v=Object(ve.get)(p,"me")||{},E=y.players.find((function(e){return e.userId===v.id}));return l.a.createElement(q.Provider,{value:Object(o.a)({},v,{playerId:t||E.id,setPlayerId:function(e){return n(e)}})},l.a.createElement(B.Provider,{value:y},"IN_PROGRESS"===y.status?l.a.createElement(ja,{me:v,subscribe:g}):l.a.createElement(Be,{me:v,subscribe:g,startCrewGame:f})))};t(144);function Ba(){var e=Object(j.a)(["\n  query isLoggedIn {\n    isLoggedIn @client\n  }\n"]);return Ba=function(){return e},e}var qa=O()(Ba());var Ua=function(){var e=Object(C.c)(qa).data;return l.a.createElement(k.a,{maxWidth:"sm"},e.isLoggedIn?l.a.createElement(S.b,null,l.a.createElement(re,{path:"/"}),l.a.createElement(pe,{path:"/create"}),l.a.createElement(ge,{path:"/join"}),l.a.createElement(ge,{path:"/join/:accessCode"}),l.a.createElement(Ha,{path:"/game/:accessCode"})):l.a.createElement(ne,null))};function Qa(){var e=Object(j.a)(["\n    directive @client on FIELD\n    \n    extend type Query {\n        isLoggedIn: Boolean!\n        me: User\n    }\n"]);return Qa=function(){return e},e}var Ja=O()(Qa()),Va=t(106);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));t(145);var _a=new m.a({cacheRedirects:{Query:{user:function(e,a,t){return(0,t.getCacheKey)({__typename:"User",id:a.userId})}}},fragmentMatcher:new m.b({introspectionQueryResultData:Va})}),Ya=Object(b.a)((function(e,a){var t=a.headers;return{headers:Object(o.a)({},t,{authorization:localStorage.getItem("readyup-token")})}})).concat(new p.a({uri:"https://readyup-crew.herokuapp.com/graphql",credentials:"same-origin"})),Ka={applyMiddleware:function(){var e=Object(c.a)(r.a.mark((function e(a,t){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,localStorage.getItem("readyup-token");case 2:a.auth=e.sent,t();case 4:case"end":return e.stop()}}),e)})));return function(a,t){return e.apply(this,arguments)}}()},Xa=new g.a({uri:"wss://readyup-crew.herokuapp.com/subscriptions",options:{reconnect:!0,connectionParams:function(){return{auth:localStorage.getItem("readyup-token")}}}});Xa.subscriptionClient.use([Ka]);var Za=Object(y.d)((function(e){var a=e.query,t=Object(v.l)(a);return"OperationDefinition"===t.kind&&"subscription"===t.operation}),Xa,Ya),et=new d.c({link:y.a.from([Object(f.a)((function(e){var a=e.graphQLErrors,t=e.networkError;a&&a.forEach((function(e){var a=e.message,t=e.locations,n=e.path;return console.log("[GraphQL error]: Message: ".concat(a,", Location: ").concat(t,", Path: ").concat(n))})),t&&console.log("[Network error]: ".concat(t))})),Za]),cache:_a,typeDefs:Ja,resolvers:{}});_a.writeData({data:{isLoggedIn:!!localStorage.getItem("readyup-token")}}),function(){var e=Object(c.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(E.persistCache)({cache:_a,storage:localStorage});case 2:u.a.render(l.a.createElement(h.a,{client:et},l.a.createElement(Ua,null)),document.getElementById("root"));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()(),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[120,1,2]]]);
//# sourceMappingURL=main.7f81b0de.chunk.js.map
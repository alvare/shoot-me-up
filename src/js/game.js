helloState = gamvas.State.extend({
        draw: function(t) {
            this.c.fillStyle = '#fff';
            this.c.font = 'bold 20px sans-serif';
            this.c.textAlign = 'center';
            this.c.fillText("Hello World!", 0, 0);
        }
});

gamvas.event.addOnLoad(function() {
    gamvas.state.addState(new helloState('helloworld'));
    gamvas.start('gameCanvas');
});

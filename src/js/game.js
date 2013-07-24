var debug = 0;
Player = gamvas.Actor.extend({
    create: function(name, x, y, controls, angle){
        this._super(name, x, y);

        var st = gamvas.state.getCurrentState();
        var defaultState = this.getCurrentState();
        var offset = {'x': 20, 'y': 25};

        this.setFile(st.resource.getImage('rsc/'+ this.name + '.png'));
        this.setCenter(offset.x, offset.y);
        this.setRotation(-angle);

        st.images[name.slice(-1)] = st.resource.getImage('rsc/shoot-' + name + '.png');

        var speed = 0,
            pump = 90,
            sCount = 0,
            friction = 0.5,
            maxS = 5,
            lasttime = 0,
            interval = 0.2,
            angspeed = 0.05;
        
        defaultState.update = function(t){
            var accel = 0;
            var posX = this.actor.position.x
            var posY = this.actor.position.y
            if (gamvas.key.isPressed(controls.up)){
                accel = pump;
                if (gamvas.timer.getSeconds() - lasttime > interval){
                    st.addActor(new Shoot('shoot-' + name + ',' + sCount, posX, posY, angle));
                    sCount++;
                    lasttime = gamvas.timer.getSeconds();
                }
            } else if (gamvas.key.isPressed(controls.down)){
                accel = -pump;
            }
            if (gamvas.key.isPressed(controls.left)){
                angle = (angle + angspeed) % (2 * Math.PI);
                this.actor.setRotation(-angle);
            } else if (gamvas.key.isPressed(controls.right)){
                angle = (angle - angspeed) % (2 * Math.PI);
                this.actor.setRotation(-angle);
            }
            speed = speed * friction + accel
            this.actor.move(Math.cos(angle) * speed * t, -1 * Math.sin(angle) * speed * t);
        };
    }
});

Shoot = gamvas.Actor.extend({
    create: function(name, x, y, angle){
        this._super(name, x, y);
        var st = gamvas.state.getCurrentState();
        this.setFile(st.images[name.split(',')[0].slice(-1)]);
        var defaultState = this.getCurrentState();
        this.setCenter(2, 2);
        this.setRotation(-angle);

        this.parentName = name.split(',')[0].split('-')[1];

        var speed = 300,
            time = gamvas.timer.getSeconds(),
            lifeTime = 4;
        
        defaultState.update = function(t){
            this.actor.move(Math.cos(angle) * speed * t, -1 * Math.sin(angle) * speed * t);
            if(gamvas.timer.getSeconds() - time > lifeTime)
                st.removeActor(this.actor);
        };
    }
});

startState = gamvas.State.extend({
        init: function(){
            this.images = {};
            var state = this;
            _.each(this.getActors(), function(a){state.removeActor(a.name)});
            this.cleanUp();

            this.addActor(new Player('p1', 200, 0, {'up': gamvas.key.UP, 'left': gamvas.key.LEFT, 'right': gamvas.key.RIGHT, 'down': gamvas.key.DOWN}, Math.PI));
            this.addActor(new Player('p2', -200, 0, {'up': gamvas.key.W, 'left': gamvas.key.A, 'right': gamvas.key.D, 'down': gamvas.key.S}, 0));

            this.timer = gamvas.timer.getMilliseconds();
            this.loser = "none";
        },
        draw: function(t){
            if(this.loser == "none"){
                // silly gamvas uses properties instead of array elments, and lodash gets all confused
                var actorsArray = []; for(var k in this.actors){ actorsArray.push(this.actors[k]) }
                var actors = _.groupBy(actorsArray, function(a){
                    return a.name[0];
                });

                var state = this;
                //console.log(actors);
                _.each(actors.p, function(p){
                    if(_.some(actors.s, function(s){return s.parentName != p.name && collides(s.position, p.position)})){
                        state.removeActor(p.name);
                        state.loser = p.name;
                    }
                });

                this.timer = gamvas.timer.getMilliseconds();
            } else {
                this.c.fillStyle = '#fff';
                this.c.font = 'bold 20px sans-serif';
                this.c.textAlign = 'center';
                this.c.fillText("Looser = " + this.loser, 0, 0);
            }
        },
        onKeyDown: function(k) {
            if (k == gamvas.key.R) {
                this.loser = "none";
                this.init();
            }
            return gamvas.key.exitEvent();
        }        
});

var collides = function(va, vb){
    if(va.distance(vb) < 30)
        return true
    else
        return false;
};

gamvas.event.addOnLoad(function(){
    gamvas.state.addState(new startState());
    gamvas.start('gameCanvas');
});

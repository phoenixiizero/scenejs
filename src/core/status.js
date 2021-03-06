/**
 * Backend that tracks statistics on loading states of nodes during scene traversal.
 *
 * This supports the "loading-status" events that we can listen for on scene nodes.
 *
 * When a node with that listener is pre-visited, it will call getStatus on this module to
 * save a copy of the status. Then when it is post-visited, it will call diffStatus on this
 * module to find the status for its sub-nodes, which it then reports through the "loading-status" event.
 *
 * @private
 */
var SceneJS_sceneStatusModule = new (function() {

    this.sceneStatus = {};

    var self = this;

    SceneJS_events.addListener(
            SceneJS_events.SCENE_CREATED,
            function(params) {
                self.sceneStatus[params.engine.id] = {
                    numLoading: 0
                };
            });

    SceneJS_events.addListener(
            SceneJS_events.SCENE_DESTROYED,
            function(params) {
                delete self.sceneStatus[params.engine.id];
            });

    this.nodeLoading = function(node) {

        var status = self.sceneStatus[node._engine.id];

        if (!status) {
            status = self.sceneStatus[node._engine.id] = {
                numLoading: 0
            };

        }
        status.numLoading++;
    };

    this.nodeLoaded = function(node) {
        this.sceneStatus[node._engine.id].numLoading--;
    };

})();


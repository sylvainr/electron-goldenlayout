const $ = require('jquery')
window.$ = $
const GoldenLayout = require('golden-layout');

var myLayout = new GoldenLayout({
	content:[{
		type: 'row',
		content:[{
			type: 'component',
			componentName: 'test-component'
		},{
			type: 'component',
			componentName: 'test-component'
		},{
			type: 'component',
			componentName: 'test-component'
		},{
			type: 'component',
			componentName: 'test-component'
		}]
	}]
});

myLayout.on( 'stackCreated', function( stack ){
	stack
		.header
		.controlsContainer
		.find( '.lm_close' ) //get the close icon
		.off( 'click' ) //unbind the current click handler
		.click(function(){
			//add your own
			if( confirm( 'really close this?' ) ) {
				stack.remove();
			}
		});
});

myLayout.on( 'tabCreated', function( tab ){
	tab
		.closeElement
		.off( 'click' ) //unbind the current click handler
		.click(function(){
			//add your own
			if( confirm( 'really close this?' ) ) {
				tab.contentItem.remove();
			}
		});
});

function updatePosition(lmElement, webview) {
      const element = $(lmElement);
      let css = element.offset();

      css['width'] = lmElement.width();
      css['height'] = lmElement.height();

      console.log(`updating webview "${webview.attr('id')}": width:${css.width}, height:${css.height}, top:${css.top}, left:${css.left}`);

    	$(webview).css(css);
}

let counter = 0;
const colors = ['red', 'green', 'blue', 'pink', 'yellow', 'white', 'gray'];

myLayout.registerComponent( 'test-component', function( container ) {
  let webview = null;
  let element = $(container.getElement());

  let webview_id = counter++;

  container.on('open', function () {

	  container.getElement().html( '<div>Loading...</div>' );

    webview = $('<webview src="./webview.html" nodeintegration ' +
      'disablewebsecurity autosize></webview>');

    webview.attr("id", "webview-" + webview_id);
    webview.css({
          "position": "absolute",
          "background": colors[webview_id % colors.length]
    });

    $(".lm_root").append(webview)

  });

  container.on('hide', function() {
  	if (webview !== null) {
      console.log(`hide fired for "${webview.attr('id')}"`);
    	webview.hide();
    }
  });

  container.on('show', function() {
  	if (webview !== null) {
      console.log(`show fired for "${webview.attr('id')}"`);
      updatePosition(element, webview);

	    webview.show();
    }
  });

  container.on('resize', function () {
    if (webview !== null) {
      updatePosition(element, webview);
    }
  });

  container.on('close', function () {
    alert('close');
  });
});

myLayout.init();

console.log("GL initialized");

(function() {

	// Settings
	var settings = {
		'lineMode' : 0,
		'scale' : 100,
		'updateEvent' : 'change',
		'noTargetName' : 'no-scale'
	};

	// Constant
	const SCRIPT_TITLE = 'テーブルの高さを拡大・縮小';
	const SCRIPT_VERSION = '0.5.0';

	// Get items
	var doc = app.activeDocument;  
	var sel = doc.selection;

	// UI Dialog
	function MainDialog() {
		this.init();
		return this;
	};
	MainDialog.prototype.init = function() {

		var unit = 20,　thisObj = this, groups = {}, panels = {}, buttons = {}, fields = {}, checkboxes = {}, radiobuttons = {}, texts = {};

		var getSelectedIndex = function(array) {
			for (var i = 0; i < array.length; i++) {
				if(array[i].value) return i;
			}
			return -1;
		};

		thisObj.dlg = new Window('dialog', SCRIPT_TITLE + ' - ver.' + SCRIPT_VERSION);
		thisObj.dlg.margins = [unit * 1.5, unit * 1.5, unit * 1.5, unit * 1.5];

		// Scale
		groups.settings = thisObj.dlg.add('group', undefined);
		groups.settings.add('statictext', undefined, '比率：');
		fields.scale = groups.settings.add('edittext', undefined, settings.scale, { name: 'scale'});
		groups.settings.add('statictext', undefined, '％');

		// Mode
		panels.options = thisObj.dlg.add('panel', undefined, 'モード：');
		panels.options.alignment = 'left';
		panels.options.margins = [unit, unit, unit, unit];
		panels.options.orientation = 'row';
		panels.options.alignment = 'center';

		radiobuttons.lineMode = [
			panels.options.add('radiobutton', undefined, '単行モード'),
			panels.options.add('radiobutton', undefined, '複数行モード'),
		];
		if(settings.lineMode > radiobuttons.lineMode.length - 1 || settings.lineMode < 0 || isNaN(settings.lineMode)) {
			settings.lineMode = 0;
		} else {
			settings.lineMode = Math.floor(settings.lineMode);
		}
		for (var i = 0; i < radiobuttons.lineMode.length; i++) {
			var radioButton = radiobuttons.lineMode[i];
			radioButton.value = false;
			radioButton.minimumSize = [120, 0];
			radioButton.alignment = 'left';
			radioButton.onClick = function() {
				settings.lineMode = getSelectedIndex(radiobuttons.lineMode);
				thisObj.preview();
			};
		}
		radiobuttons.lineMode[settings.lineMode].value = true;

		// Show hint
		try {
			doc.layers.getByName(settings.noTargetName);
		} catch(e) {
			panels.hint = thisObj.dlg.add('panel', undefined, 'ヒント：');
			panels.hint.margins = [unit, unit, unit, unit];
			texts.hint = panels.hint.add('statictext', undefined, '文字以外で変形の影響を受けたくないオブジェクトは、グループ化やシンボル化した上で「' + settings.noTargetName + '」という名前のレイヤーに配置しておきます', {multiline:true});
			texts.hint.bounds = [0, 0, 250, 75];
		}

		// UI Buttons
		groups.buttons = thisObj.dlg.add('group', undefined);
		groups.buttons.margins = [unit, unit / 2, unit, unit * 0];
		groups.buttons.alignment = 'center';
		groups.buttons.orientation = 'row';

		buttons.cancel = groups.buttons.add('button', undefined, 'キャンセル', {name: 'cancel'});
		buttons.ok = groups.buttons.add('button', undefined, '実行', { name: 'ok'});

		// Fields appearance
		if(settings.updateEvent !== 'change' && settings.updateEvent !== 'changing') settings.updateEvent = 'changing';
		for(var key in fields) {
			fields[key].name = key;
			fields[key].alignment = 'left';
			fields[key].bounds = [0, 0, 80, 23];
			fields[key].addEventListener(settings.updateEvent, textValidate);
		}
		fields.scale.active = true;

		// validate Field values
		function textValidate(event) {
			var target = event.target;
			var textRange = {'min' : 0, 'max' : 1000};
			if(target.text == '') {
				target.text = settings[target.name];
			} else if(isNaN(Number(target.text))) {
				alert('半角数値を入力してください');
				target.text = settings[target.name];
			} else if(Number(target.text) > textRange.max) {
				alert(textRange.max + ' 以下の半角数値を入力してください');
				target.text = settings[target.name];
			} else if(Number(target.text) <= textRange.min) {
				alert(textRange.min + ' より大きい半角数値を入力してください');
				target.text = settings[target.name];
			} else {
				settings[target.name] = Number(target.text);
				thisObj.preview();
			}
		}

		buttons.ok.onClick = function() {
			try {
				app.redo();
				app.redraw();
				app.undo();
			} catch(e) {
				alert('エラーが発生して処理を実行できませんでした\nエラー内容：' + e);
			} finally {
				thisObj.closeDialog();
			}
		}
		buttons.cancel.onClick = function() {
			thisObj.closeDialog();
		}

	};
	MainDialog.prototype.showDialog = function() {
		this.preview();
		this.dlg.show();
	};
	MainDialog.prototype.closeDialog = function() {
		this.dlg.close();
	};
	MainDialog.prototype.preview = function() {
		try {
			mainProcess();
			app.redraw();
			var dummy = sel[0].layer.pathItems.add();
			dummy.remove();
			app.undo();
		} catch(e) {
			alert('エラーが発生して処理を実行できませんでした\nエラー内容：' + e);
		}
	};

	// Validation and show dialog
	var dialog = new MainDialog();
	if (!doc || sel.length < 1) {
		alert('オブジェクトが選択されていません');
	} else {
		dialog.showDialog();
	}

	// Main Process
	function mainProcess() {

		var scale = [100, settings.scale];
		var targetItems = getTargetItems(sel);
		var originItem = getOriginItem(targetItems);
		var yOrigin = originItem.geometricBounds[1];

		for (var i = 0; i < targetItems.length; i++) {
			if(targetItems[i].layer.name === settings.noTargetName || targetItems[i].name === settings.noTargetName) {
				targetItems[i].resize(scale[0], scale[1], true, false, false, false, 100, Transformation.DOCUMENTORIGIN);
				targetItems[i].resize(scale[0], 100 / scale[1] * 100, true, false, false, false, 100, Transformation.CENTER);
			} else if(targetItems[i].typename === 'TextFrame') {
				var dummy_textframe = targetItems[i].duplicate();

				var target_line = settings.lineMode === 0 ? 0 : targetItems[i].lines.length - 1;
				var max_text = getMaxTextRangeInLine(targetItems[i], target_line);
				var body_diff = getBodyDiff(max_text);
				var dummy_rect_height = settings.lineMode === 0 ? targetItems[i].height - body_diff : max_text.size * max_text.verticalScale / 100;

				var dummy_rect = targetItems[i].layer.pathItems.rectangle(targetItems[i].top, targetItems[i].left, targetItems[i].width, dummy_rect_height);
				dummy_rect.resize(scale[0], scale[1], true, false, false, false, 100, Transformation.DOCUMENTORIGIN);
				dummy_rect.resize(scale[0], 100 / scale[1] * 100, true, false, false, false, 100, Transformation.CENTER);
				if(targetItems[i].kind === TextType.AREATEXT) targetItems[i].resize(scale[0], scale[1], true, false, false, false, 100, Transformation.TOP);
				targetItems[i].top = dummy_rect.top;
				targetItems[i].contents = '';
				for (var j = 0; j < dummy_textframe.textRanges.length; j++) {
					dummy_textframe.textRanges[j].leading *= scale[1] / 100;
					dummy_textframe.textRanges[j].baselineShift *= scale[1] / 100;
					dummy_textframe.textRanges[j].duplicate(targetItems[i]);
				}
				dummy_textframe.remove();
				dummy_rect.remove();
			} else {
				targetItems[i].resize(scale[0], scale[1], true, false, false, false, 100, Transformation.DOCUMENTORIGIN);
			}
		}

		var yCurrent = originItem.geometricBounds[1];
		for (var i = 0; i < targetItems.length; i++) {
			targetItems[i].translate(0, (yOrigin - yCurrent));
		}
	}

	// Get the item for the point of origin
	function getOriginItem(items) {
		var target = items[0];
		for (var i = 0; i < items.length; i++) {
			if(target.geometricBounds[1] < items[i].geometricBounds[1]) target = items[i];
		}
		return target;
	}

	// Get target items
	function getTargetItems(objects) {
		var items = [];
		for(var i = 0; i < objects.length; i++) {
			if(objects[i].typename === 'GroupItem' && (objects[i].layer.name !== settings.noTargetName || objects[i].name === settings.noTargetName)) {
				items = items.concat(getTargetItems(objects[i].pageItems));
			} else {
				items.push(objects[i]);
			}
		}
		return items;
	}

	// Get the largest text range
	function getMaxTextRangeInLine(textframe, num) {
		var line = textframe.lines[num];
		var target_textrange = textframe.textRanges[line.characterOffset - 1];
		for (var i = line.characterOffset - 1; i < line.characterOffset + line.length - 1; i++) {
			var current_size = textframe.textRanges[i].size * textframe.textRanges[i].verticalScale / 100;
			if(current_size > (target_textrange.size * target_textrange.verticalScale / 100)) target_textrange = textframe.textRanges[i];
		}
		return target_textrange;
	}

	// Get the difference between the bounding box and the font size
	function getBodyDiff(textRange) {
		var diff = 0;
		var size = textRange.size * textRange.verticalScale / 100;
		var dummy_text = sel[0].layer.textFrames.add();
		textRange.duplicate(dummy_text);
		diff = dummy_text.height - size;
		dummy_text.remove();
		return diff;
	}

}());


/*!
 * defaultwebsite.net v1.0.0
 * Homepage: https://hackinc.net
 * Copyright 2012-2018 SwartHack
 * Licensed under ISC
 * Based on...
*/
//////////////////////////////////////////////////////////////////////
/// KO View Model module
//////////////////////////////////////////////////////////////////////
define('dws/model', ['dws/model-utils'], function (ModelUtil) {

    /////////////////////////////
    ///
    /////////////////////////////
    var viewModel = {

        //////////////////////////////////////////////////
        ///
        //////////////////////////////////////////////////
        data: ko.observable(''),
        target: ko.observable(''),
        dataType: ko.observable(''),
        dataJson: ko.observable(''),
        targetJson: ko.observable(''),
        abort: function (xhr, status, error) {
            viewModel.errorStatus(status);
            viewModel.errorXhr(xhr);
            viewModel.errorMsg(error);
        },
        errorXhr: ko.observable(''),
        errorStatus: ko.observable(''),
        errorMsg: ko.observable(''),
        waiting: ko.observable(false),
        waitingTarget: ko.observable(''),
        xsrfToken: ko.observable([]),

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        sources: ko.observableArray([]),
        source: ko.observable(''),
        sourceId: function (sid) {
            var index = viewModel.sources().findIndex(s => s.id == sid);
            viewModel.sourceIndex(index);
            var source = viewModel.sources()[index];
            viewModel.source(source);
            
        },
        sourceIndex: ko.observable(''),
        sourcesCount: ko.pureComputed(function () {
            return 'Records: ' + viewModel.sources().length
        }, this),
        addSource: function (source) {
            viewModel.sources.unshift(source);
            viewModel.sourceId(source.id);
        },
        //canDeleteSource: function () { return viewModel.sources().length > 0 },
        removeSource: function (sid) {
            var index = viewModel.sources().findIndex(s => s.id == sid);
            var source = viewModel.sources()[viewModel.sourceIndex()];
            viewModel.sources.remove(source);
            viewModel.source(undefined);
        },
        sourceAdded: function (parent, index, item) {
            var $parent = $(parent); 
            var $item = $(item);
            //viewModel.sources.sort();
            $item.hide().fadeIn('slow');
        },
        comments: ko.observableArray([]),
        comment: ko.observable(''),
        commentId: function (cid) {
            var index = viewModel.comments().findIndex(c => c.id == cid);
            viewModel.commentIndex(index);
            viewModel.comment(viewModel.comments()[index]);
            return viewModel.comment();
        },
        commentIndex: ko.observable(''),
        commentsCount: ko.pureComputed(function () { return 'Records: ' + viewModel.comments().length }, this),
        commentTitle: ko.pureComputed(function () { return 'Ima a stupid title!'}, this),
        addComment: function (comment) {
            viewModel.comments.unshift(comment);
            viewModel.commentId(comment.id);
        },
        removeComment: function (cid) {
            var index = viewModel.comments().findIndex(c => c.id == cid);
            var comment = viewModel.comments()[viewModel.commentIndex()];
            viewModel.comments.remove(comment);
            viewModel.comment('');
        },
        commentAdded: function (item) {
            var $item = $(item);
            $item.hide().fadeIn('slow');
            console.log('Comment afterAdd... ');
        },
        canAddComment: function () { return viewModel.sources().length === 0 ? false : true },
         //canDeleteComment: function () {
        //    var list = $('#comments.list-group').children();
        //    var $element = $(list[viewModel.commentIndex()]);
        //    var isClass = $element.hasClass('active')
        //    return isClass;
        //    //return $($('#comments.list-group').children()[viewModel.commentIndex()]).hasClass('active')
        //}

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        uploadFilesInfo: ko.observableArray([]),  // dialog binding 'selected-upload-files' template
        uploadFiles: ko.observableArray([]), //matching array of IForm files.
        mimeTypes: ko.observableArray(['image/*', 'application/pdf', 'video/mp4']), //these should come from settings
        uploadFilesSize: ko.pureComputed( function () { return viewModel.uploadFiles.sumProperty('size') }, this),
        uploadFilesCount: ko.pureComputed( function () { return viewModel.uploadFiles().length }, this),
        uploadCount: ko.pureComputed(function () { return 'Number files: ' + viewModel.uploadFiles().length }, this),
        uploadSize: ko.pureComputed(function () { return 'Total size: ' + viewModel.getFileSize(viewModel.uploadFiles.sumProperty('size')) }, this),
        showFileUpload: ko.pureComputed(function() { return viewModel.uploadFiles().length > 0 && !viewModel.isMaxUpload()}, this),
        getFileSize: function (size) {
            var fileSize = 0;
            if (size > 1048576) {
                fileSize = Math.round(size * 100 / 1048576) / 100 + " MB";
            }
            else if (size > 1024) {
                fileSize = Math.round(size * 100 / 1024) / 100 + " KB";
            }
            else {
                fileSize = size + " bytes";
            }
            return fileSize;
        },
        isMaxUpload: function () {
            var max = ( parseInt(viewModel.uploadFilesSize()) + parseInt(viewModel.serverSpaceCurrent()) ) > parseInt(viewModel.serverSpaceMax() );
            return max
        },

       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        contentCacheQueue: ko.observableArray([]), // TODO
        
        serverFiles: ko.observableArray([]),  // the server-side files after upload
        serverSpaceMax: ko.observable(50000000),
        serverSpaceCurrent: ko.pureComputed(function () { return viewModel.serverFiles.sumProperty('fileSize') }, this),
        serverFilesCount: ko.pureComputed(function () { return viewModel.serverFiles().length }, this),
        serverSpace: ko.pureComputed(function () {
            var max = viewModel.serverSpaceMax();
            var current = viewModel.serverSpaceCurrent();
            var num = parseInt(max) - parseInt(current);
            return viewModel.getFileSize(num);
        }, this),
        fileMimeType: ko.observable(''),
        fileViewApi: ko.observable(''),
        fileViewTarget: ko.observable(''),
        imageViewApi: ko.pureComputed(function () { return viewModel.fileMimeType().match('image/*') ? viewModel.fileViewApi : '#'; }, this),
        docViewApi: ko.pureComputed(function () { return viewModel.fileMimeType.match('application/pdf') ? viewModel.fileViewApi : '#'; }, this),
        
        videoViewApi: ko.pureComputed(function () {
            if (viewModel.fileMimeType().match('video/*'))
                return viewModel.fileViewApi();
            else
                return null;
        }, this),
        pdfWorker: ko.observable(''),
        exif: ko.observableArray([]) // image header details

        //thumb: ko.observable(),
        //thumbRendered: function (elements, item) {
        //    var count = elements.length;
        //    console.log('thumbRendered: ' + elements + item);
        //},
        //thumbAdded: function (parent, index, element) {
        //    var $image = $(parent).find('img');
        //    var rendered = $image[0].complete;
        //    console.log('thumbAdded-rendered: ' + $image.attr('class') + rendered);
        //    if (!rendered) {
        //        console.log('thumbAdded-!rendered: ' + $image.attr('class'));
        //        $image.on('load', function () {
        //            finishLoadingThumb($(parent));
        //        });
        //    }
        //    else {
        //        console.log('thumbAdded-rendered: ' + $image.attr('class'));
        //        finishLoadingThumb($(parent));
        //    }

        //}
        
    };


    ////////////////////////////////////////
    /// model events/actions
    /// TODO - move to model-utils module
    ///////////////////////////////////////

    //viewModel.fileViewApi.subscribe(function (newFile) {

    //    // what's my visible content area
    //    var $target = $(viewModel.fileViewTarget());

    //    if (!$target.is(':visible'))
    //    {
    //        $('.content-area').hide();
    //        $target.show();
    //    }
    //});


    ////////////////////////////////////////
    /// model events/actions
    ///////////////////////////////////////


    // subscribe to any ajax errors
    viewModel.errorMsg.subscribe(function (error) {
        if (error != null)
        {
            var $ajaxerr = $('#ajax-error');
            if (!ko.dataFor($ajaxerr[0])) {
                ko.applyBindings(viewModel, $ajaxerr[0]);
            }

            $($ajaxerr).html(viewModel.errorXhr().responseText);

            $('#ajax-error').dialog({
                width: 600,
                height: 400,
                autoOpen: true,
                modal: true,
                buttons: {
                    OK: function () { $(this).dialog("close"); }
                }
            });
        }
        else
        {
            $('viewModel.errorData').dialog();

        }
    });

    ////////////////////////////////////////
    /// model events/actions
    ///////////////////////////////////////
    viewModel.data.subscribe(function (newdata) {

        if (viewModel.target())
            $(viewModel.target()).html(newdata);
        else
            $(newdata).dialog();
    });

    //viewModel.source.subscribe(function (data) {
    //    viewModel.sources.sortByName('sourceName', 'asc')
    //});



    ////////////////////////////////////////
    /// Sandpit - Comments Manager
    /// Source subscribe events/actions
    ///////////////////////////////////////
    viewModel.source.subscribe(function (source) {
       
        if (source == undefined) {
            var prev = viewModel.sourceIndex() - 1;
            if (prev >= 0)
            {
                source = viewModel.sources()[prev];
                viewModel.sourceId(source.id);
            }
            return;
        }
       
        ///TODO
        /// this should all be done with a class binding
        var $element = $($('#sources-table tbody tr')[viewModel.sourceIndex()])
        $element.addClass('active').siblings().removeClass('active');
        //re-set comments
        //viewModel.comments([]);
        viewModel.comments(source.comments == null ? [] : source.comments);

        if ( viewModel.comments().length > 0 ) {
            viewModel.commentId(viewModel.comments()[0].id);
        }  

        viewModel.sources.sortByName('sourceName', 'asc')
        // scroll to visible if necessary
        $element.scrollToTop();
        //console.log('source subscribe:' + source.sourceName);
    });

    ////////////////////////////////////////
    /// Sandpit - Comments Manager
    /// Comment subscribe events/actions
    ///////////////////////////////////////
    viewModel.comment.subscribe(function (comment) {

        if ( comment == undefined ) {
            var prev = viewModel.commentIndex() - 1;
            if ( prev >= 0 ) {
                comment = viewModel.comments()[prev];
                viewModel.commentId(comment.id);
            }
            return;
        }
      
        ///TODO
        /// this should all be done with a class binding
        var list = $('#comments.list-group').children();
        var $element = $(list[viewModel.commentIndex()]);
        $element.addClass('active').siblings().removeClass('active');
        $('.comment.card a#comment-delete').addClass('disabled');
        $element.find('a#comment-delete').removeClass('disabled');
        

         // sort here ? We souldn't have too?
         // TODO -Always adds on top, need to animate nicely, offer asc/desc
        viewModel.comments.sortByDateTime('datetime', 'asc');

        //console.log('comment subscribe:' + comment.id);
    });



    ////////////////////////////////////////
    /// Waiting subscribe events/actions
    ///////////////////////////////////////
    viewModel.waiting.subscribe(function (wait) {

        ModelUtil.waitStatus(wait, viewModel.waitingTarget());
    });

    ////////////////////////////////////////
    /// observableArray DateTime sort extension
    ///////////////////////////////////////
    ko.observableArray.fn.sortByDateTime = function (property, direction) {

        return this.sort(function (a, b) {
            var dateA = new Date(a[property]);
            var dateB = new Date(b[property]);
            if (direction == 'asc') {
                return (Date.parse(dateA) == Date.parse(dateB) ? 0 :
                    (Date.parse(dateA) > Date.parse(dateB) ? -1 : 1))
                //return dateA.getTime() - dateB.getTime();
            }
            return (Date.parse(dateA) == Date.parse(dateB) ? 0 :
                (Date.parse(dateA) < Date.parse(dateB) ? -1 : 1))
            //return dateB.getTime() - dateA.getTime();
        });
    };

    ko.observable.fn.sortByName = function (property, direction) {
        return this.sort(function (a, b) {
            var textA = a[property];
            var textB = b[property];
            if (direction == 'asc') {
                return textA == textB ? 0 : (textA < textB ? -1 : 1);
            }
            return textA == textB ? 0 : (textA > textB ? -1 : 1);
        });

    };

    ko.observableArray.fn.sumProperty = function (property) {

        var total = 0;
    
        for (var i = 0, len = this().length; i < len; i++) {
            total += this()[i].size
        }

        return total;
    };

    return viewModel;
});

//////////////////////////////////////////////////////////////////////
/// KO viewModel extensions module
//////////////////////////////////////////////////////////////////////
define('dws/model-utils', function () {


    function callAborted(xhr, textStatus, error) {

     }

    ///////////////////////////////////////
    /// this is for async ajax calls to server
    //////////////////////////////////////
    function waitStatus(status, target) {

        if (status) {
            $(target).addClass('waiting');
        }
        else {
            $(target).removeClass('waiting');
        }
    }

    ///////////////////////////////////////
    /// this is for actual DOM element loading
    ///////////////////////////////////////
    function loadingStatus(status, target) {
        var completed = $(target)[0].complete;
        if (!completed) {
            $(target)[0].addClass('loading');
            $(target).load(function () {
                $(target).removeClass('loading');
            });
        }
    }

    return {
        waitStatus: waitStatus,
        loadingStatus: loadingStatus,
        callAborted: callAborted
        
    }

});
//////////////////////////////////////////////////////////////////////
/// message dispatcher module
//////////////////////////////////////////////////////////////////////
define('dws/dispatcher', ['dws/model'], function (ViewModel) {

    function xhrRequest(url) {
            
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onload = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert(this.responseText);

            }
            else {
                alert("Message not found!" + this.readyState + ":" + this.status + "-" + this.responseText);
            }
        }
        //Pass the value to a web page on server as query string using XMLHttpObject.    
        xmlHttp.open("GET", url, true);
        xmlHttp.send();

    }

    function ajaxRequest(settings) {
        //waitEffects(true);
        $.ajax(settings)
        .done(function (data, textStatus, xhr) {
            //based on requested data type
            ViewModel.data(data); 
        })
        .fail(function (xhr, textStatus, error) {
            ViewModel.abort(xhr, textStatus, error)
        })
        .always(function () {
        //waitEffects(false);
        });
    }


    function ajaxRequestDefer(settings, deferred) {
        $.ajax(settings)
            .done(function (data, textStatus, xhr) {
                deferred.resolve(data); //ok, fires deferred callback
            })
            .fail(function (xhr, textStatus, error) {
                deferred.reject(this.responseText + '\n' + error)
            })
            .always(function () {
        
            });
    }

    return {
        xhrRequest: xhrRequest,
        ajaxRequest: ajaxRequest,
        ajaxRequestDefer: ajaxRequestDefer
    }
});
//////////////////////////////////////////////////////////////////////
/// actions module
//////////////////////////////////////////////////////////////////////
define('dws/actions', ['dws/controller'],
function (Control) {
    
    $(document).ready(function () {

        
        /////////////////////////////
        /// click events
        ////////////////////////////
        $('.dws-note').on('click',  function (e) {
            e.preventDefault();
            var $rundown = $(this);
            $('.dws-note').removeClass("selected");
            $rundown.addClass("selected");

            Control.sendMessage($rundown);
        });

        $('.nav-link').on('click', function (e) {
            e.preventDefault();
            var $item = $(this);
            Control.sendMessageDefer($item);
        });

        

        /////////////////////////////
        /// show/hide events
        /// TODO - optimize these events...
        ////////////////////////////
        $(document).on("shown.bs.collapse", "#doc-resume", function (e) {
            $('#contact.card').animate({ scrollTop: $(this).offset().top }, 800);
            $('[data-target="#doc-resume"] h4 i').switchClass('fa-eye', 'fa-eye-slash');

            if ($('#doc-cv').hasClass('show')) {
                $('#doc-cv').removeClass('show');
                $('[data-target="#doc-cv"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
            }
            if ($('#doc-masters').hasClass('show')) {
                $('#doc-masters').removeClass('show');
                $('[data-target="#doc-masters"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
            } 
        });

        $(document).on("hide.bs.collapse", "#doc-resume", function (e) {
            $('[data-target="#doc-resume"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
        });

        $(document).on('shown.bs.collapse', '#doc-cv', function (e) {
            $('#contact.card').animate({ scrollTop: $(this).offset().top }, 800);
            $('[data-target="#doc-cv"] h4 i').switchClass('fa-eye', 'fa-eye-slash');

            if ($('#doc-resume').hasClass('show')) {
                $('#doc-resume').removeClass('show');
                $('[data-target="#doc-resume"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
            }
            if ($('#doc-masters').hasClass('show')) {
                $('#doc-masters').removeClass('show');
                $('[data-target="#doc-masters"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
            } 
        });

        $(document).on('hide.bs.collapse','#doc-cv', function (e) {
            $('[data-target="#doc-cv"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
        });

        $(document).on('shown.bs.collapse', '#doc-masters', function (e) {
            e.preventDefault();
            $('#contact.card').animate({ scrollTop: $(this).offset().top }, 800);
            $('[data-target="#doc-masters"] h4 i').switchClass('fa-eye', 'fa-eye-slash');

            if ($('#doc-resume').hasClass('show')) {
                $('#doc-resume').removeClass('show');
                $('[data-target="#doc-resume"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
            }
            if ($('#doc-cv').hasClass('show')) {
                $('#doc-cv').removeClass('show');
                $('[data-target="#doc-cv"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
            }
        });

        $(document).on('hide.bs.collapse', '#doc-masters', function (e) {
            $('[data-target="#doc-masters"] h4 i').switchClass('fa-eye-slash', 'fa-eye');
        });

        //$('#modal-action-template').on('show.bs.modal', function (e) {
        //    e.preventDefault();
        //    // get event source
        //    var $item = $(e.relatedTarget());
        //    Control.sendMessage($item, '#target-modal');
        //})

        $(document).on('show.bs.modal', '#modal-action-template', function (e) {
            //e.preventDefault();
            // get event source
            var $item = $(e.relatedTarget);
            var $modal = $(this);
            $modal.find('.modal-title').text('Add New ' + $item.attr('data-target-id'));
            Control.sendMessage($item, '#target-modal');
        });

        $(document).on('shown.bs.modal', '#modal-action-template', function (e) {
            //e.preventDefault();
            // get modal 
            var $item = $(e.target);
            $item.find('input:visible').first().focus();
        });

        /////////////////////////////
        /// popover init
        ////////////////////////////

        var options = {
            trigger: 'hover',
            title: 'What is the Notepad',
            content: 'My non-authoritative notes and ramblings. In my words and IMHO...',
            footer: 'I am a Bootstrap popover...',
            placement: 'bottom',
            delay: { "show": 200, "hide": 100 }

        }

        $('#notebook-info').popover(options);
        
        //$('#rundown-info').on('click', function (e) {
        //    $(this).popover('toggle');
        //})

       

        /////////////////////////////
        /// SandPit events
        ////////////////////////////


        $(document).on('click', '.nav-item', function (e) {
            e.preventDefault();
            var $item = $(e.target);
            $('.nav-item').removeClass('active');
            $item.closest('.nav-item').addClass('active');
            Control.sendMessage($item);
        });

        $(document).on('click', 'a.sandpit-toggle-text', function (e) {
            e.preventDefault();
            var $link = $(e.target);
            var $text = $link.parent().siblings('.card-text.expand');

            if ($text.length == 1) {
                $text.removeClass('expand');
                $link.text('More...');
            }
            else {

                $('.sandpit-wrapper').find('.sandpit-item').children('.card-text.expand').removeClass('expand');
                $('.sandpit-wrapper').find('.sandpit-toggle-text').text('More...');
                $link.parent().siblings('.card-text').addClass('expand');
                $link.text('Less...');
            }
        });

        /////////////////////////////
        /// File Ops stuff
        ////////////////////////////
       
     

        $('div#footer-scroll').endlessScroll({ width: '100%', height: '20px', steps: -2, speed: 30, mousestop: true });

    });

    return {
     
    };
});

//////////////////////////////////////////////////////////////////////
/// sandpit module - MutationObserver Here!!!
//////////////////////////////////////////////////////////////////////
define('dws/sandpit', ['dws/model'], function (viewModel) {

    //lets monitor the sand box area for new content and bind accordingly
    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };

    var observerKo = new MutationObserver(function (changes) {
        changes.forEach(function (change) {
            
            if (change.addedNodes.length > 0) {

                var $dataNodes = $(change.addedNodes).find('[data-bind]');
                $dataNodes.each(function () {
                    var $node = $(this);
                    try {
                        //if (!ko.dataFor($node[0])) {
                            ko.applyBindings(viewModel, $node[0])
                        //}
                    } catch (e) {
                        console.log("ko re-bind exception....")
                    }
                })
            }
        });
    });

    function observeKo(state) {
        if (state) {
            observerKo.observe(document.getElementById('sandpit-target-area'), config);
            //observerKo.observe(document.getElementById('file-ops-client'), config);
        }
        else {
            observerKo.disconnect();
        }
    }

    //var observerSandItems = new MutationObserver(function (changes) {
    //    changes.forEach(function (change) {

    //        if (change.changedNodes.length > 0) {
    //            var $dataNodes = $(change.addedNodes).find('[data-bind]');
    //            $dataNodes.each(function () {
    //                var $node = $(this);
    //                try {
    //                    if (!ko.dataFor($node[0])) { ko.applyBindings(ViewModel, $node[0]) }
    //                } catch (e) {
    //                    console.log("ko re-bind exception....")
    //                }
    //            })
    //        }
    //    });
    //});

    //function observeSandItems(state) {
    //    if (state) {
    //        observerSandItems.observe(document.getElementById('sandbox-items'), config);
    //    }
    //    else {
    //        observerSandItems.disconnect();
    //    }
    //}
    ///
    ///if we ever need for some reason....
    ///
    //function findNode($nodes) {
    //    $nodes.each(function () {
    //        var $node = $(this);
    //        if ($node.children().length() > 0) {
    //            findNode($node.children());
    //        }

    //        if ($node.attr('data-bind')) {
    //            console.log($node.attr('data-bind'));  // the new element	
    //            try {
    //                ko.applyBindings(ViewModel, $node);
    //            } catch (e) {
    //                alert(e.message);
    //            }
    //        }

    //    });
    //}

    return {
        observeKo: observeKo
    }
});
//////////////////////////////////////////////////////////////////////
/// Main controller for event declarations, etc.
//////////////////////////////////////////////////////////////////////
define('dws/controller', ['dws/model', 'dws/dispatcher'],
function (viewModel, Dispatch) {

    function test() {
        var settings = {
            url: "/Home/Talk?message=Hello Server",
            cache: false,
            dataType: 'html'
        }
        viewModel.target(null);
        Dispatch.ajaxRequest(settings);
    }

    //////////////////////////////////
    ///
    ////////////////////////////////
    function showContentArea(selector) {
        if (!$(selector).is(':visible')) {
            hideAllContent();
            $(selector).show(); // beware that using an animated show (fadeIn, etc) may conflict with the visibility check
        }
    }

    function hideAllContent() {
        $('.content-area').hide();
    }
    
    //////////////////////////////////
    /// Incorporate this into an HtmlHelper DwsLink()
    ////////////////////////////////
    function parseNavUrl($link) {
        var url;

        if ($link.attr('data-target-controller') && $link.attr('data-target-action')) {
            url = "/" + $link.attr('data-target-controller') + "/" + $link.attr('data-target-action');
        }
        else {
            url = "/" + $link.attr('data-target-controller') + "/GetView";
        }

        if ($link.attr('data-target-id')) {
            url = url + '?id=' + $link.attr('data-target-id');
        }

        return url;
    }

    //////////////////////////////////
    ///
    ////////////////////////////////
    function sendMessage($item, target) {
        if (!target)
            target = $item.attr('data-target');
        var url = parseNavUrl($item);
        var settings = {
            url: url,
            cache: false
        }
        viewModel.target(target);
        Dispatch.ajaxRequest(settings);
       
    }

    //////////////////////////////////
    ///
    ////////////////////////////////
    function sendMessageDefer($item) {
        var target = $item.attr('data-target')
        var url = parseNavUrl($item);
        var settings = {
            url: url,
            cache: false
        }
        
        var deferred = new $.Deferred();
        deferred.done(function (data) {
            if (!data) {
                alert('invalid data from server');
            }
            else {
                // or return deferred to calling action
                viewModel.data(data);
            }
        }).fail(function (error) {
            alert(error);
        });

        viewModel.target(target);
        Dispatch.ajaxRequestDefer(settings, deferred);

    }

    //////////////////////////////////
    ///
    ////////////////////////////////
    function initKO() {
        ko.applyBindings(viewModel);
    }

    function setXsrf(xsrf) {
        viewModel.xsrfToken(xsrf);
    }

    function setPdfWorker(pdfWorker) {
        PDFJS.workerSrc = pdfWorker;
        viewModel.pdfWorker(pdfWorker);
    }

    return {
        initKO: initKO,
        test: test,
        sendMessage: sendMessage,
        sendMessageDefer: sendMessageDefer,
        showContentArea: showContentArea,
        hideAllContent: hideAllContent,
        parseNavUrl: parseNavUrl,
        setXsrf: setXsrf,
        setPdfWorker: setPdfWorker
    }
});

//////////////////////////////////////////////////////////////////////
/// comments module
//////////////////////////////////////////////////////////////////////
define('dws/comments', ['dws/controller', 'dws/model'],
function (Control, viewModel) {

    function GetSources() {
        
        var settings = {
            url: "/Comments/GetSources",
            cache: false
        }
        viewModel.waitingTarget('#navbar-main');
        viewModel.waiting(true);
        //// integrate into dispatcher.js  TODO
        $.ajax(settings)
            .done(function (data) {
                viewModel.sources([]);
                viewModel.sources(data);
                viewModel.sources.sortByName('sourceName', 'asc')
                // this is against my pattern!!!! TODO
                // model should deal with this, but only first time loading...
                if (data.length > 0) {
                 //$('#sources-table tbody tr:first').addClass('active');
                    viewModel.sourceId(viewModel.sources()[0].id);
                }
                
            })
            .fail(function (xhr, textStatus, error) {
                viewModel.aborted(xhr, textStatus, error);
            })
            .always(function (data, textStatus, xhr) {
                viewModel.waiting(false);

            });
    }

    $(document).on('click', '#sources-table tbody tr', function (e) {
        var $item = $(e.currentTarget);
        var id = $item.attr("id");
        //$item.addClass('active').siblings().removeClass('active');
        viewModel.sourceId(id);

    });

    $(document).on('click', '.comment.card', function (e) {
        e.preventDefault();
        var $item = $(e.currentTarget);
        var id = $item.attr("id");
        //$item.addClass('active').siblings().removeClass('active');
        viewModel.commentId(id);

    });

    $('#modal-action-template').on('show.bs.modal', function (e) {
        //e.preventDefault();
        var $item = $(e.relatedTarget);
        Control.sendMessage($item, '#modal-action-template');
    });

    $(document).on('submit', 'form#create-source', function (e) {

        e.preventDefault();
        var $form = $(this);
        //var $submitButton = $('.submit', $form);
        //$submitButton.attr("disabled", true);
        $form.attr('disabled', true);

        // here one way to do it from form values to JSON data
        // this works well with unobtrusive validation
        //
        //serialize form values to JSON
        var formvals = $form.serializeArray();

        var settings = {
            url: '/Comments/CreateSource',
            type: 'POST',
            data: formvals
        }

        $.ajax(settings)
            .done(function (data, textStatus, xhr) {
                if (xhr.status == 200) {
                    $form.closest('#modal-action-template').modal('hide');
                    viewModel.addSource(data.source);
                }
                else {
                    $('#target-modal').html(data);
                }
            })
            .fail(function (xhr, textStatus, error) {
                $form.closest('#modal-action-template').modal('hide');
                viewModel.abort(xhr, textStatus, error);
            });
    });

    $(document).on('submit', 'form#create-comment', function (e) {

        e.preventDefault();
        var $form = $(this);
        //var $submitButton = $('.submit', $form);
        //$submitButton.attr("disabled", true);
        $form.attr('disabled', true);

        // populate SourceId
        $('input#SourceId.form-control', $form).val(viewModel.source().id);
        //serialize form values to JSON
        var formvals = $form.serializeArray();
        
        viewModel.waitingTarget('.modal-header');
        viewModel.waiting(true);

        var settings = {
            url: '/Comments/CreateComment',
            type: 'POST',
            data: formvals
        };

        $.ajax(settings)
            .done(function (data, textStatus, xhr) {
            if (xhr.status == 200) {
                $form.closest('#modal-action-template').modal('hide');
                viewModel.addComment(data.comment);
            }
            else {
                $('#target-modal').html(data);
            }
            
        }).fail(function (xhr, textStatus, error) {
            $form.closest('#modal-action-template').modal('hide');
            viewModel.abort(xhr, textStatus, error);
        }).always(function (data, textStatus, xhr) {
            viewModel.waiting(false);

        });

    });

    $(document).on('click', 'a#source-delete', function (e) {

        //if (viewModel.comments().length > 0) {
            
        //    $.confirm({
        //        title: 'Cascade Delete Source and Comments?',
        //        content: 'There are child Comments! Continuing will delete the Source record and all child Comments. This action can not be undone!!!',
        //        buttons: {
        //            confirm: function () { deleteSource(); },
        //            cancel: function () { return; }
        //        }
        //    });
        //}
        //else {
        //    deleteSource();
        //}
    });

    function deleteSource() {

        $.ajax({
            url: '/Comments/DeleteSource?sid=' + viewModel.source().id,
            type: 'POST',
            headers: { 'RequestVerificationToken': viewModel.xsrfToken() }

        }).done(function (data, textStatus, xhr) {
            if (xhr.status == 200) {
                viewModel.removeSource(data);
            }

        }).fail(function (xhr, textStatus, error) {
            viewModel.abort(xhr, textStatus, error);
        });
    }

    $(document).on('click', 'a#comment-delete', function (e) {
       
        //$.confirm({
        //    title: 'Delete Comment(s)?',
        //    content: 'This action can not be undone!!!',
        //    buttons: {
        //        confirm: function () { deleteComment(); },
        //        cancel: function () { return; }
        //    }
        //});
    });

    function deleteComment() {
        $.ajax({
            url: '/Comments/DeleteComment?cid=' + viewModel.comment().id,
            type: 'POST',
            headers: { 'RequestVerificationToken': viewModel.xsrfToken() }
        }).done(function (data, textStatus, xhr) {
            if (xhr.status == 200) {
                viewModel.removeComment(data);
            }
        }).fail(function (xhr, textStatus, error) {
            viewModel.abort(xhr, textStatus, error);
        });
    }

    return {
        GetSources: GetSources
    }
});




        


//////////////////////////////////////////////////////////////////////
/// thumb client module
//////////////////////////////////////////////////////////////////////
define('dws/thumbnail', [],
    function () {

        //PDFJS.workerSrc = '/lib/_site/dist/js/pdf.worker.js';

        //////////////////////////////////////////////////////////////////////
        /// 
        //////////////////////////////////////////////////////////////////////
        function getThumbFromFile(file, callback) {

            if ( file.type.match('image/*') ) {
                thumbFromImageFile(file, callback);
                return;
            }
                    
            if (file.type.match('application/*')) {
                thumbFromAppFile(file, callback);
                return;
            }

            if (file.type.match('video/*')) {
                thumbFromVideoFile(file, callback);
                return;
            } 

            // unsupported/invalid
        }

        //////////////////////////////////////////////////////////////////////
        /// 
        //////////////////////////////////////////////////////////////////////
        function thumbFromImageFile(file, callback) {
            var reader = new FileReader();
            reader.file = file;

            reader.onload = (function (e) {
                callback(reader.file,e.target.result);
            });

            reader.readAsDataURL(file);
        }

        //////////////////////////////////////////////////////////////////////
        /// TODO
        /// Gonna have to deal with each application type individually as we 
        /// support more. Need a smarter way to do it as there are so many!!!
        //////////////////////////////////////////////////////////////////////
        function thumbFromAppFile(file, callback) {

            if (file.type.match('/pdf')) {
                var reader = new FileReader();
                reader.file = file;
                reader.callback = callback;

                reader.onload = (function (e) {
                    thumbFromPdf(reader.file, e.target.result, reader.callback);
                });

                reader.readAsDataURL(file);
            }
        }

        //////////////////////////////////////////////////////////////////////
        /// 
        //////////////////////////////////////////////////////////////////////
        function thumbFromVideoFile(file, callback) {
            
            var reader = new FileReader();
            reader.file = file;
            reader.callback = callback;

            reader.onload = (function (e) {

                //var objVideo = videojs(domVideo);
                //objVideo.height(90);
                //objVideo.width(160);
                //objVideo.preload('auto');

                //$(video).show();
                //$('.main-content').append(video);

                //objVideo.on('loadeddata', function () {
                //    objVideo.currentTime(10);
                //});

                //objVideo.on('seeked', function () {
                //    generateThumbnail(this, file, callback);
                //});

                var domVideo = document.createElement('video');
                domVideo.height = 90;
                domVideo.width = 160;
                domVideo.preload = true;

                domVideo.addEventListener('loadeddata', function (e) {
                    domVideo.currentTime = 10;
                }, false);

                domVideo.addEventListener('seeked', function () {
                    generateThumbnail(domVideo, file, callback);
                }, false);

                domVideo.src = e.target.result;

                //objVideo.src(e.target.result);
                //video.load();
          
            });

            reader.readAsDataURL(file);
        }


         //////////////////////////////////////////////////////////////////////
        /// 
        //////////////////////////////////////////////////////////////////////
        function generateThumbnail(video, file, callback) {

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.height = 90;
            canvas.width = 160;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            //var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            //$('.main-content').append(canvas);
            var dataurl = canvas.toDataURL();

            callback(file, dataurl);

            //clean up, no dispose on DOM elements, how does HTML5 API deal with this?
            //TODO
            //objVideo = videojs(video);
            video.src = null;
            //video.dispose();
        }

         //////////////////////////////////////////////////////////////////////
        /// 
        //////////////////////////////////////////////////////////////////////
        function thumbFromPdf(file, fileUrl, callback) {
            
            PDFJS.getDocument(fileUrl).then(function (pdf) {

                pdf.getPage(1).then(function (page) {
                    var viewport = page.getViewport(0.5);
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    var renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };

                    page.render(renderContext).then(function () {
                        //set to draw behind current content
                        ctx.globalCompositeOperation = "destination-over";
                        //set background color
                        ctx.fillStyle = "#fff";
                        //draw on entire canvas
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        // send back an img from the canvas which contains the page contents
                        callback(file, canvas.toDataURL());

                    });

                });
            });
        }

        return {
            getThumbFromFile: getThumbFromFile
        }

    });

//////////////////////////////////////////////////////////////////////
/// File ops client module
//////////////////////////////////////////////////////////////////////
define('dws/fileops-client', ['dws/controller','dws/thumbnail', 'dws/model'],
    function (Control, Thumbnail, viewModel) {

        ///////////////////////////////////////////////////////////////////////
        /// init cause it controls/binds async html content not present at site load
        /// we could pre-load everything, or lazy/late load like this
        /// pros and cons....TODO
        //////////////////////////////////////////////////////////////////////
        function init() {

            $('#file-input').change(function (evt) {
                filesSelected(evt);
            });
            //$("form#file-upload button[id=Cancel_btn]").click(function () {
            //    Cancel_btn_handler()
            //});
            $('a#file-upload-open').on('click', function (e) {

                var options = {
                    minWidth: 400,
                    maxWidth:400,
                    //height: 'auto',
                    modal: true,
                    title: 'Upload Files'
                };
                $('#file-ops-client').dialog(options);
            });

            //$('#file-ops-client').on('dialogclose', function (event, ui) {
            //    var $diag = $(this);
            //    $diag.hide(); //animate TODO
            //});

            //$('.file-ops-client').on('click', 'a.upload-file-delete',  function (e) {
            //    e.preventDefault();
            //    fileRemove(e);
            //});

            $(document).on('click', 'a.upload-file-delete', function (e) {
                e.preventDefault();
                fileRemove(e);
            });
            
            var dropZone = document.getElementById('file-upload-drop');
            dropZone.addEventListener('dragover', handleDragOver, false);
            dropZone.addEventListener('drop', filesSelected, false);
            dropZone.addEventListener('dragenter', dragenterHandler, false);
            dropZone.addEventListener('dragleave', dragleaveHandler, false);
            $.blockUI.defaults.overlayCSS = {
                backgroundColor: '#000',
                opacity: 0.6
            };

            //$.blockUI.defaults.css = {
            //    padding: 0,
            //    margin: 5,
            //    width: '60%',
            //    top: '30%',
            //    left: '20%',
            //    color: '#000',
            //    border: '3px solid #aaa',
            //    backgroundColor: '#fff'
            //};
            //$.blockUI({ message: $('#file-ops-client') });
        }

        function isValidMimeType(file) {

            for (var i = 0; i < viewModel.mimeTypes().length; i++) {
                if ( file.type.match(viewModel.mimeTypes()[i]) ) {
                    return true;
                }
            }
            return false;
        }

        ///////////////////////////////////////////////////////////////////////
        /// 
        //////////////////////////////////////////////////////////////////////
        function filesSelected(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            $('#file-upload-drop').removeClass('hover');

            var files = (evt.target.files || evt.dataTransfer.files);
            var filelist = [];

            for (var i = 0, f; f = files[i]; i++) {

                if (!isValidMimeType(f)) {
                    //TODO
                    // Don't push error file
                    //viewModel.uploadFiles.push({ name: fileInfo.name, size: fileInfo.size(), type: fileInfo.type, error: error });
                    //notify ?
                    continue;
                }
                else {
                    var fname = f.name;
                    var dups = viewModel.uploadFilesInfo().findIndex(f => f.name == fname);
                    if (dups > -1) { continue; }

                    Thumbnail.getThumbFromFile(f, pushFile);
                   
                }
            }
        }

        ///////////////////////////////////////////////////////////////////////
        /// This will not happen in order!!!
        //////////////////////////////////////////////////////////////////////
        function pushFile(file, thumbContext) {
            var fileSize = viewModel.getFileSize(file.size);
            //var codec = getCodec(file);
            viewModel.uploadFilesInfo.push({ name: file.name, size: fileSize, type: file.type, thumbcontext: thumbContext });
            viewModel.uploadFiles.push(file);
        }

        function getCodec(file) {
           
        }

        function fileRemove(e) {
            var $item = $(e.originalEvent.target).closest('.file-info-container');
            var index = $item.index();
            // remove from viewModel uploadFiles
            viewModel.uploadFilesInfo.splice(index, 1);
            viewModel.uploadFiles.splice(index, 1);
        }

        ///////////////////////////////////////////////////////////////////////
        ///  file upload api async call
        //////////////////////////////////////////////////////////////////////
        $(document).on('submit', 'form#file-upload', function (e) {

            e.preventDefault();
            var $form = $(this);
            
            // we are going to manually client-side validate here before submit
            // WHY? Well, I'll tell you why....
            // TODO
            var desc = $('textarea#description', $form[0]).val();
            if ( desc == '' || desc.length < 10 ) {
                $('span#description-validate', $form[0]).text('Description is required, ten(10) character minimum...');
                return;
            }
            $('textarea#description', $form[0]).val(desc);
            $('textarea#description', $form[0]).text(desc);

            //disable for once and for all 
            // TODO
            $form.attr('disabled', true); // does not seem to work?!

             //var formvals = $form.serializeArray();
            // here is another way to get form values for JSON data
            // get the DOM element from Jquery
            // Have not tested with unobstrusive, but we are not using Model validation here
            // TODO - can't effectively deal with FormData here, but Controller likes it...
            
            var formData = new FormData($form[0]);
            formData.set('files', '');

            //load in the selected files, check for dups? YES!
            for (var i = 0; i < viewModel.uploadFiles().length; i++) {
                var file = viewModel.uploadFiles()[i];
                formData.append('files', file);
            }
           
            var settings = {
                url: '/api/dws/files/upload',  //Server web api
                type: 'POST',
                xhr: function () {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) { // Check if upload property exists
                        myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                data: formData,
                contentType: false,
                processData:false
            };

            // TODO
            // as always we want to dispatch, but need to account for variety of request types and targets.
            viewModel.waitingTarget('#navbar-main');
            viewModel.waiting(true);
            $($form,'.progress .upload-progress').show();

            $.ajax(settings)
                .done(function (data, textStatus, xhr) {
                    if (xhr.status == 200) {
                        viewModel.serverFiles(data);
                    }
                    else {
                        viewModel.abort(data, textStatus, null);
                    }
                })
                .fail(function (xhr, textStatus, error) {
                    viewModel.abort(xhr, textStatus, error);
                })
                .always(function () {
                    viewModel.uploadFiles([]);
                    viewModel.uploadFilesInfo([]);
                    $('#file-ops-client').dialog('close');
                    //$('#file-ops-client').find('.progress.upload-progress').hide();
                    //$('#file-ops-client').remove();
                    viewModel.waiting(false);
                });
        });

        ///////////////////////////////////////////////////////////////////////
        /// update upload progress
        /// TODO progress per file
        //////////////////////////////////////////////////////////////////////
        function progressHandlingFunction(e) {
            if (e.lengthComputable) {
                var percentComplete = Math.round(e.loaded * 100 / e.total);
                $("#file-progress").css("width", percentComplete + '%').attr('aria-valuenow', percentComplete);
                $('#file-progress span').text(percentComplete + "%");
            }
            else {
                $('#file-progress span').text('unable to compute');
            }
        }
        
        ///////////////////////////////////////////////////////////////////////
        /// Drop zone drag and drop stuff
        //////////////////////////////////////////////////////////////////////
        function handleDragOver(evt) {
            evt.preventDefault();
            evt.dataTransfer.effectAllowed = 'copy';
            evt.dataTransfer.dropEffect = 'copy';
        }

        function dragenterHandler() {
            //$('#drop_zone').removeClass('drop_zone');
            $('#file-upload-drop').addClass('hover');
        }

        function dragleaveHandler() {
            $('#file-upload-drop').removeClass('hover');
        }

        function OnDeleteAttachmentSuccess(data) {

            if (data.ID && data.ID != "") {
                $('' + data.ID).fadeOut('slow');
            }
            else {
                alert("Unable to Delete");
                console.log(data.message);
            }
        }

        function Cancel_btn_handler() {
            $('#file-upload-list').empty();
            //$('#file-upload-list').show();
           // $.unblockUI();
            viewModel.waitEffects(false);
        }

        return {
            init: init,
            progressHandlingFunction: progressHandlingFunction,
            fileRemove: fileRemove
        }
    });
//////////////////////////////////////////////////////////////////////
/// File operations content module
//////////////////////////////////////////////////////////////////////
define('dws/fileops-content', ['dws/controller', 'dws/model'],
    function (Control, viewModel) {
        /////////////////////////////////////////////////////////////
        /// late init because we are not present in DOM on site load
        /////////////////////////////////////////////////////////////
        function init() {

            /////////////////////////////////////////////////////////////
            /// Thumbnail click
            /////////////////////////////////////////////////////////////
            $(document).on('click', 'ul#thumbnails li', function (e) {
                e.preventDefault();
                
                var $link = $(this);
                if (!$link.hasClass('selected')) {
                    openFile($link);
                }
            });


            //$('.main-document.content-area').on('show', function (e) {
            //    e.preventDefault();
               
            //    if (viewModel.fileMimeType().match('application/pdf')) {
            //        loadPdfFile();
            //        $(this).children('#my-pdf-container').show();
            //        $('#doc-embedded').hide();
            //    }
            //    else {
            //        $('#my-pdf-container').hide();
            //        //$('#doc-embedded').show();
            //    }

            //});

            $('.main-document.content-area').on('hide', function () {

            });
            
            $(document).on('keydown', '#main-content-area', function (e) {
                //if (!shortcutsEnabled) {
                //    return;
                //}

                if (e.keyCode === 37) { //prev
                    contentPrev();
                    return false;
                }

                if (e.keyCode === 39) { //next
                    contentNext();
                    return false;
                }
            });

            $('#content-left').on("click", function (e) {
                contentPrev();
            });

            $('#content-right').on("click", function (e) {
                contentNext();
            });

            $('.main-content-area').on("swipeleft", function (e) {
                contentPrev();
            });

            $('.main-image').on("swiperight", function (e) {
                contentNext();
            });

            

            hideAllContent();

            getContent();

            //// expand this
            //$('#col-util').hide();
            //$('#col-main').addClass('full-size');
        }

        ///////////////////////////////////////////////////////////////////////
        // Subscribing to viewModel anywhere you reference it!!
        ////////////////////////////////////////////////////////////////////////
        viewModel.fileViewApi.subscribe(function (newFile) {

            // we have a new file, depending on type we have to account for model binding
            // behavior, <embed> and <video>.
            // do this before show

            if (viewModel.fileMimeType().match('application/pdf')) {
                // try to get pdfjs viewer to work, TODO
                // must replace the element each time! binding does not work!
                // default to HTML5 only
                var target = document.querySelector('.main-content .main-document');
                while (target.firstChild) {
                    target.removeChild(target.firstChild);
                }
                var emb = document.createElement('embed');
                emb.setAttribute('id', 'doc-embedded');
                emb.setAttribute('src', viewModel.fileViewApi());
                emb.setAttribute('type', viewModel.fileMimeType());
                target.appendChild(emb);

                // pdf-js
                //loadPdfFile();
            }
            else if (viewModel.fileMimeType().match('image/*')) {
                // call out to do this TODO
                //var exif = parseEXIF(data.EXIF);
                //if (exif) {
                //    viewModel.exif(exif);
                //    exif.length ? $('.image-info.image-exif').fadeIn() : $('.image-info.image-exif').fadeOut();
                //}
                //data.Desription ? $('.image-info-descr').fadeIn() : $('.image-info-descr').fadeOut();

                //$('#ImageVPathEditImageInfo').val(data.VirtualPath);
            }
            else if (viewModel.fileMimeType().match('video/*')) {

                // switch to videojs TODO
                // this replaces the element each time! binding does not work!
                var video = document.querySelector('.main-content .main-video video');
                var source = document.createElement('source');

                source.setAttribute('src', viewModel.videoViewApi());
                source.setAttribute('type', viewModel.fileMimeType());

                //delete <source> child elements
                $(video).empty();  //detach

                video.appendChild(source);
                video.load();
            }

            // now make it visible
            // what's my visible content area
            var $target = $(viewModel.fileViewTarget());

            if (!$target.is(':visible')) {
                $('.content-area').hide();
                $target.css('display', 'inline-flex');
                $target.show();
            }
        });

        ///////////////////////////////////////////////////////////////////////
        // TODO - all ajax calls through dispatcher, extend model to deal with it
        ////////////////////////////////////////////////////////////////////////
        function getContent() {

            var settings = {
                url: "/api/dws/files/list",
                cache: false
            }
            viewModel.waitingTarget('#navbar-main');
            viewModel.waiting(true);
            $.ajax(settings)
                .done(function (data, textStatus, xhr) {
                    viewModel.serverFiles([]);
                    viewModel.serverFiles(data);
                })
                .fail(function (xhr, textStatus, error) {
                    viewModel.abort(xhr, textStatus, error);
                })
                .always(function (data, textStatus, xhr) {
                    viewModel.waiting(false);
                });
        }

        ///////////////////////////////////////////////////////////////////////
        // 
        ////////////////////////////////////////////////////////////////////////
        function clickThumbnail($thumbnail) {
            //figure this latter
            //window.history && window.history.pushState && window.history.replaceState({ image: "", virtualPath: "" }, "", "");
            openFile($thumbnail);
        }

        ///////////////////////////////////////////////////////////////////////
        // 
        ////////////////////////////////////////////////////////////////////////
        function openFile($thumbnail) {
            var fileApi = $thumbnail.attr('data-api');
            var fileTarget = $thumbnail.attr('data-target');
            var type = $thumbnail.attr('data-type');

            styleSelectedThumbnail($thumbnail);

            viewModel.fileMimeType(type);
            viewModel.fileViewTarget(fileTarget);
            viewModel.fileViewApi(fileApi);
        }

        ///////////////////////////////////////////////////////////////////////
        // 
        ////////////////////////////////////////////////////////////////////////
        function loadPdfFile() {

            var SEARCH_FOR = ''; 
            var mypdf = document.getElementById('my-pdf-viewer');
            var container = mypdf.querySelector('#viewerContainer');

            // (Optionally) enable hyperlinks within PDF files.
            var pdfLinkService = new PDFJS.PDFLinkService();
            
            var pdfViewer = new PDFJS.PDFViewer({
                container: container
            });
            pdfLinkService.setViewer(pdfViewer);

            // (Optionally) enable find controller.
            var pdfFindController = new PDFJS.PDFFindController({
                pdfViewer: pdfViewer
            });
            pdfViewer.setFindController(pdfFindController);

            container.addEventListener('pagesinit', function () {
                // We can use pdfViewer now, e.g. let's change default scale.
                pdfViewer.currentScaleValue = 'page-width';

                if (SEARCH_FOR) { // We can try search for things
                    pdfFindController.executeCommand('find', { query: SEARCH_FOR });
                }
            });

            // Loading document.
            PDFJS.getDocument(viewModel.fileViewApi()).then(function (pdfDocument) {
                // Document loaded, specifying document for the viewer and
                // the (optional) linkService.
                pdfViewer.setDocument(pdfDocument);
                pdfLinkService.setDocument(pdfDocument, null);
            });
        }

        function contentNext() {
            var linkNext = $('ul#thumbnails li.selected').next('li');
            $(linkNext).trigger('click');
        }

        function contentPrev() {
            var linkPrev = $('ul#thumbnails li.selected').closest('li');
            $(linkPrev).trigger('click');
        }

        

        function styleSelectedThumbnail($thumbnail) {
            $('ul#thumbnails li').removeClass("selected");
            $thumbnail.addClass("selected");
        }

        function empty() {
            viewModel.thumbnails([]);
        }

        function hideAllContent() {
            $('.content-area').hide();
        }

        function showContent($selector) {

        }

        

        return {
            init:init,
            contentNext: contentNext,
            contentPrev: contentPrev,
            clickThumbnail: clickThumbnail,
            hideAllContent: hideAllContent,
            showContent: showContent
           
        };

    });
//////////////////////////////////////////////////////////////////////
/// init module - TODO eliminate redundant requires, control initiates all
//////////////////////////////////////////////////////////////////////
require(['dws/actions']);
require(['dws/comments']);
require(['dws/sandpit']);
require(['dws/model-utils']);
require(['dws/thumbnail']);
require(['dws/fileops-client']);
require(['dws/fileops-content']);


//require('video-codec-js/lib/encoder');
//require('video-codec-js/lib/decoder');

require(['dws/controller'],
function (control) {
    
    $(document).ready(function () {
        control.initKO();
    });
});

//////////////////////////////////////////////////////////////////////
/// globals go here
//////////////////////////////////////////////////////////////////////

/// This just deals with X,Y in a scrolling list
////////////////////////////////////////////////////////////////////////
$.fn.scrollToTop = function () {

    var $element = this;
    var $parent = $element.scrollParent() ? $element.scrollParent() : $(window);

    var viewport = {
        top: $parent.scrollTop(),
        bottom: $parent.height()
    };

    console.log('parent viewport: top ' + viewport.top + ', left ' + viewport.left + ', bottom ' + viewport.bottom + ', right ' + viewport.right);

    console.log('viewport parent bottom: ' + viewport.bottom);
    var position = $element.position();
    position.bottom = position.top + $element.height();
    position.right = position.left + $element.width();

    console.log('element position top ' + position.top + ', left ' + position.left + ', bottom ' + position.bottom + ', right ' + position.right);

    // above or below = !in-between
    if ((position.bottom < viewport.top) || (position.top > viewport.bottom)) {
        $parent.animate({ scrollTop: position.top }, 800);
    }
}

$.fn.isWithinParent = function () {
    var $element = this;
    var $parent = $element.scrollParent() ? $element.scrollParent() : $(window);

    var viewport = {
        top: $parent.scrollTop(),
        left: $parent.scrollLeft()
    };
    viewport.right = viewport.left + $parent.width();
    viewport.bottom = viewport.top + $parent.height();

    
    var bounds = $element.offset();
    bounds.right = bounds.left + $element.outerWidth();
    bounds.bottom = bounds.top + $element.outerHeight();

    
    //return ((viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

}

// this gives us the on show/hide events for containers
$(function () {
    $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
});

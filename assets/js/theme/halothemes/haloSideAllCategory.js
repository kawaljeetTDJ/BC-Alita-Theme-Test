export default function() {
    if ($('.all-categories-list').length > 0) {
        $(document).on('click', '.all-categories-list .icon-dropdown', event => {
            var $target = $(event.currentTarget).parent();

            $target.siblings().removeClass('is-clicked current-cate');
            $target.toggleClass('is-clicked');
            $target.siblings().find("> .dropdown-category-list").slideUp("slow");
            $target.find("> .dropdown-category-list").slideToggle("slow");
        });

        $('.all-categories-list li').each((index, element) => {
            if ($(element).hasClass('current-cate')) {
                $(element).find("> .dropdown-category-list").slideToggle("slow");
            }
        });
    }
}

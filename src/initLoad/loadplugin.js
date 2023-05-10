import Vue from 'vue'
import {
    Button,
    Lazyload,
    Col,
    Row,
    Grid,
    GridItem,
    Image,
    NavBar,
    List,
    Icon,
    Popup,
    Loading,
    Notify,
    Field,
    CellGroup,
    Cell,
    Form,
    Overlay,
    Toast,
    Tab,
    Tabs,
    Tag,
    Dialog,
    Checkbox,
    CheckboxGroup,
    RadioGroup,
    Radio,
    Collapse,
    CollapseItem,
    Popover,
    Stepper,
    Pagination,
    DropdownMenu, 
    DropdownItem 

} from 'vant'
import 'vant/lib/index.less'
import 'animate.css'
import MyMenu from '@/components/menu'
import MyVideo from '@/components/com/myvideo'
import MyTb from '@/components/com/mytable'


function loadVant() {
    Vue.use(List)
    Vue.use(Button)
    Vue.use(Col)
    Vue.use(Row)
    Vue.use(Grid)
    Vue.use(GridItem)
    Vue.use(Image)
    Vue.use(Lazyload, { lazyComponent: true, loading: require('@/assets/loading_icon.gif') })
    Vue.use(NavBar)
    Vue.use(Icon)
    Vue.use(Popup)
    Vue.use(Loading)
    Vue.use(Notify)
    Vue.use(Field)
    Vue.use(Cell)
    Vue.use(CellGroup)
    Vue.use(Form)
    Vue.use(Overlay)
    Vue.use(Toast)
    Vue.use(Tab)
    Vue.use(Tabs)
    Vue.use(Tag)
    Vue.use(Dialog)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Collapse)
    Vue.use(CollapseItem)
    Vue.use(Popover)
    Vue.use(Stepper)
    Vue.use(Pagination)
    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)

    Vue.component('MyMenu', MyMenu)    
    Vue.component('MyVideo', MyVideo)
    Vue.component('MyTb', MyTb)
}
loadVant()
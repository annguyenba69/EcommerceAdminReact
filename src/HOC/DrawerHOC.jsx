import { Button,  Drawer, Space } from 'antd';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleFalseAction } from '../redux/reducers/DrawerReducer';

export default function DrawerHOC() {
    const { visible, title, Component } = useSelector(state => state.DrawerReducer);
    const dispatch = useDispatch();
    const onClose = () => {
        dispatch(setVisibleFalseAction())
    }
    return (
        <Drawer
            title={title}
            width={720}
            onClose={onClose}
            visible={visible}
            bodyStyle={{
                paddingBottom: 80,
            }}
        >
          {Component}

        </Drawer>
    )
}
